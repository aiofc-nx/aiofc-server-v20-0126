import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { ConfigModule } from './config/config.module';
import { LoggerModule, loggingInitConfig } from '@aiofc/pino-logger';
import { EnvConfig } from './config/env.config';

@Module({
  imports: [ConfigModule, LoggerModule.forRootAsync(loggingInitConfig)],
  controllers: [AppController],
  providers: [AppService, EnvConfig],
})
export class AppModule {}
