import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@aiofc/pino-logger';
import { randomUUID } from 'crypto';
import { ConfigService } from './config/config.service';
import { I18nService } from 'nestjs-i18n';
import { ClsService } from 'nestjs-cls';
import { I18nTranslations } from './generated/i18n.generated';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

/**
 * 应用程序引导函数
 *
 * 主要机制:
 * 1. 使用 Fastify 作为底层 HTTP 框架
 * - Fastify 比 Express 性能更好,适合高性能场景
 * - 通过 FastifyAdapter 适配 NestJS
 *
 * 2. 日志系统配置
 * - 使用自定义日志服务 CustomLoggingService
 * - 通过拦截器 CustomLoggingInterceptor 实现请求日志
 * - 结合 ClsService 实现请求上下文追踪
 *
 * 3. 安全与路由配置
 * - enableCors() 启用跨域资源共享
 * - setGlobalPrefix 设置全局路由前缀
 *
 * 要点:
 * - 异步启动确保所有依赖加载完成
 * - 使用依赖注入获取配置和服务
 * - 统一的错误处理和日志记录
 */
async function bootstrap() {
  try {
    // 创建 Fastify 适配器，使用自定义日志配置
    const adapter = new FastifyAdapter({
      logger: false, // 保持禁用 Fastify 内置日志，因为我们使用自定义的 PinoLogger
      genReqId: () => randomUUID(), // 使用 UUID 替代默认的 req-n 格式
    });

    // // 创建 NestJS 应用，使用 Fastify 适配器
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      adapter,
      {
        bufferLogs: true, // 缓存启动日志
        // logger: false, // 禁用 NestJS 默认日志
      }
    );

    const config = app.get<ConfigService>(ConfigService);
    // 注册全局异常过滤器
    const httpAdapter = app.get(HttpAdapterHost);
    const i18n = app.get<I18nService<I18nTranslations>>(I18nService);
    const cls = app.get(ClsService);
    app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter, i18n, cls));

    // 使用自定义日志服务
    const logger = app.get(Logger);
    app.useLogger(logger);

    // 启用跨域资源共享
    app.enableCors();
    // 设置全局路由前缀
    app.setGlobalPrefix(config.app.globalPrefix);

    adapter.getInstance().addHook('preHandler', (request, _reply, done) => {
      if (request.body) {
        (request.raw as any).body = request.body;
      }
      done();
    });

    // 启动 HTTP 服务器
    await app.listen(config.app.port, '0.0.0.0');

    console.log(
      `🚀 Application is running on: 
      http://localhost:${config.app.port}/${config.app.globalPrefix}`
    );
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('Unhandled bootstrap error:', err);
  process.exit(1);
});
