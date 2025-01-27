import { Inject, Provider } from '@nestjs/common';
import { PinoLogger } from './pino-logger';

/** 装饰器令牌前缀 */
const decoratedTokenPrefix = 'PinoLogger:';

/** 存储所有被装饰的日志上下文名称集合 */
const decoratedLoggers = new Set<string>();

/**
 * 注入 PinoLogger 的装饰器工厂函数
 * @param context - 日志上下文名称，默认为空字符串
 * @returns Inject 装饰器实例
 * @example
 * ```typescript
 * class UserService {
 *   constructor(
 *     @InjectPinoLogger('UserService')
 *     private readonly logger: PinoLogger
 *   ) {}
 * }
 * ```
 */
export function InjectPinoLogger(context = '') {
  decoratedLoggers.add(context);
  return Inject(getLoggerToken(context));
}

/**
 * 创建带有上下文的日志提供者
 * @param context - 日志上下文名称
 * @returns 配置好的日志提供者
 * @internal
 */
function createDecoratedLoggerProvider(context: string): Provider<PinoLogger> {
  return {
    provide: getLoggerToken(context),
    useFactory: (logger: PinoLogger) => {
      logger.setContext(context);
      return logger;
    },
    inject: [PinoLogger],
  };
}

/**
 * 为所有被装饰的上下文创建提供者数组
 * @returns PinoLogger 提供者数组
 * @example
 * ```typescript
 * \@Module({
 *   providers: [
 *     ...createProvidersForDecorated(),
 *     // 其他提供者
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export function createProvidersForDecorated(): Array<Provider<PinoLogger>> {
  return [...decoratedLoggers.values()].map(createDecoratedLoggerProvider);
}

/**
 * 生成日志器的唯一标识符
 * @param context - 日志上下文名称
 * @returns 完整的日志器标识符
 * @internal
 */
export function getLoggerToken(context: string): string {
  return `${decoratedTokenPrefix}${context}`;
}
