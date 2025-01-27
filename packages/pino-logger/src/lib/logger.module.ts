import { Global, Module, DynamicModule, Inject } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces';

import { ClsModule } from 'nestjs-cls';

import { createProvidersForDecorated } from './inject-pino-logger';
import { Params, PARAMS_PROVIDER_TOKEN } from './interface/params';
import { PinoLogger } from './pino-logger';
import { Logger } from './logger';

/**
 * As NestJS@11 still supports express@4 `*`-style routing by itself let's keep
 * it for the backward compatibility. On the next major NestJS release `*` we
 * can replace it with `/{*splat}`, and drop the support for NestJS@9 and below.
 */

@Global()
@Module({ providers: [Logger], exports: [Logger] })
export class LoggerModule {
  static async forRootAsync(params?: Params): Promise<DynamicModule> {
    /**
     * 首先Params是一个接口
     * 其次Provider是一个类型，是NestJS的Provider类型
     *
     * 这里Provider<Params> 通过泛型指定这个提供者的形态应当符合Params接口约束
     * 通过这样的方式指定paramsProvider为
     * {
     *  provide: PARAMS_PROVIDER_TOKEN,
     *  useValue: params || {},
     * }
     * 其作用是接收使用者传入参数
     * 而使用者传入的参数需要符合Params & Partial<LoggerConfig>约束
     *
     * 可见，定义这个forRoot函数时，我们并没有具体确定值，
     * 而是通过Provider<LoggerParams> 通过泛型指定这个提供者的形态应当符合LoggerParams接口约束
     * 而使用者传入的参数需要符合LoggerParams & Partial<LoggerConfig>约束
     * 这样，就实现了参数的传递和约束
     */
    const paramsProvider: Provider<Params> = {
      provide: PARAMS_PROVIDER_TOKEN,
      useValue: params || {
        sensitiveHeaders: [],
        sensitiveFields: [],
        logRequestBody: false,
        logResponseBody: false,
      },
    };

    const decorated = createProvidersForDecorated();

    return {
      module: LoggerModule,
      imports: [
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: true,
            setup: (cls, req) => {
              cls.set('requestId', req.id);
              cls.set('traceId', req.headers['x-trace-id'] || req.id);
            },
          },
        }) as any,
      ],
      providers: [Logger, ...decorated, PinoLogger, paramsProvider],
      exports: [Logger, ...decorated, PinoLogger, paramsProvider],
      global: true,
    };
  }

  constructor(@Inject(PARAMS_PROVIDER_TOKEN) private readonly params: Params) {}
}
