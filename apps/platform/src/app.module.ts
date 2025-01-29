import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { ConfigModule } from './config/config.module';
import {
  DetailedLoggingInterceptor,
  LoggerModule,
  loggingInitConfig,
  SimpleLoggingInterceptor,
} from '@aiofc/pino-logger';
import { ConfigService } from './config/config.service';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  I18nJsonLoader,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { DatabaseModule } from './database/database.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { TenantContextService } from './common/tenant-isolation/tenant-context.service';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { TenantMiddleware } from './middleware/tenant.middleware';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync(loggingInitConfig) as Promise<DynamicModule>,
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'zh',
        loaderOptions: {
          path: path.join(__dirname, 'i18n'),
          watch: true,
          includeSubfolders: true,
        },
        loaders: [I18nJsonLoader],
        typesOutputPath: path.join(
          __dirname,
          '../../../apps/platform/src/generated/i18n.generated.ts'
        ),
        logging: true,
        debug: true,
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    DatabaseModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    TenantContextService,
    {
      provide: APP_INTERCEPTOR, // nestjs 内置的令牌
      useClass:
        process.env.NODE_ENV === 'development'
          ? DetailedLoggingInterceptor
          : SimpleLoggingInterceptor,
    },
  ],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
