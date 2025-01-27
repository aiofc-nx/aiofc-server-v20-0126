import { MiddlewareConfigProxy } from '@nestjs/common/interfaces';
import { Logger, DestinationStream } from 'pino';
import { Options } from 'pino-http';
/**
 * 已传递的logger类型
 */
export type PassedLogger = { logger: Logger };

/**
 * 参数接口
 *
 * @remarks
 * 该接口定义了PinoLogger的配置参数
 */
export interface Params {
  /**
   * `pino-http` 模块的可选参数
   * @see https://github.com/pinojs/pino-http#pinohttpopts-stream
   */
  pinoHttp?: Options | DestinationStream | [Options, DestinationStream];

  /**
   * 路由的可选参数。它应该实现接口
   * NestJS 内置 `MiddlewareConfigProxy['exclude']` 的参数。
   * @see https://docs.nestjs.com/middleware#applying-middleware
   * 它可用于禁用自动 req/res 日志和从以下日志中删除请求上下文。它适用于所有请求
   * 默认。如果您只需要关闭自动请求/响应
   * 记录某些特定（或所有）路由，但保留应用程序的请求上下文
   * 日志使用 `pinoHttp.autoLogging` 字段。
   */
  exclude?: Parameters<MiddlewareConfigProxy['exclude']>;

  /**
   * 路由的可选参数。它应该实现接口
   * NestJS 内置 `MiddlewareConfigProxy['forRoutes']` 的参数。
   * @see https://docs.nestjs.com/middleware#applying-middleware
   * 它可用于禁用自动 req/res 日志和
   * 从以下日志中删除请求上下文。它适用于所有请求
   * 默认。如果您只需要关闭自动请求/响应
   * 记录某些特定（或所有）路由，但保留应用程序的请求上下文
   * 日志使用 `pinoHttp.autoLogging` 字段。
   */
  forRoutes?: Parameters<MiddlewareConfigProxy['forRoutes']>;

  /**
   * 如果您使用的是可选参数，可跳过 pino 配置
   * FastifyAdapter，并且已经在适配器的配置中配置了记录器。优点
   * 这种方法的缺点在常见问题解答部分中有描述
   * 文档：
   * @see https://github.com/iamolegga/nestjs-pino#faq.
   */
  useExisting?: true;

  /**
   * 用于更改结果日志中的属性名称"context"的可选参数，
   * 所以日志会是这样的：
   * {"level":30,..."RENAME_CONTEXT_VALUE_HERE":"AppController"}
   */
  renameContext?: string;

  /**
   * 可选参数，用于在调用期间分配响应记录器
   * `PinoLogger.分配`。默认情况下，"分配"不会影响响应日志
   * （例如"请求已完成"）。
   */
  assignResponse?: boolean;

  /**
   * 不需要记录日志的路径
   */
  ignorePaths?: (string | RegExp)[];

  /**
   * 需要脱敏的请求头
   */
  sensitiveHeaders?: string[];

  /**
   * 需要脱敏的字段
   */
  sensitiveFields?: string[];

  /**
   * 是否记录请求体
   */
  logRequestBody?: boolean;

  /**
   * 是否记录响应体
   */
  logResponseBody?: boolean;

  /**
   * 追踪配置
   */
  trace?: {
    /**
     * 是否启用追踪
     */
    enabled: boolean;
    /**
     * 追踪ID头
     */
    traceIdHeader?: string;
    /**
     * 父追踪ID头
     */
    parentIdHeader?: string;
    /**
     * 采样率 (0-1)
     */
    sampleRate?: number;
    /**
     * 是否记录请求耗时分布
     */
    timing?: boolean;
    /**
     * 是否记录调用链路
     */
    callStack?: boolean;
    /**
     * 是否记录系统资源使用
     */
    resources?: boolean;
    /**
     * 缓存追踪配置
     */
    cache?: {
      /**
       * 是否启用缓存追踪
       */
      enabled: boolean;
      /**
       * 是否记录缓存键
       */
      logKeys: boolean;
      /**
       * 是否记录缓存值
       */
      logValues: boolean;
    };
  };

  /**
   * 日志传输配置
   */
  transport?: {
    /**
     * 传输目标
     */
    target: string;
    /**
     * 传输选项
     */
    options: {
      /**
       * 最小日志级别
       */
      minimumLevel: string;
      /**
       * 是否单行输出
       */
      singleLine: boolean;
      /**
       * 时间戳格式
       */
      translateTime: string;
      /**
       * 是否启用彩色输出
       */
      colorize: boolean;
      /**
       * 级别信息是否在前
       */
      levelFirst: boolean;
      /**
       * 忽略的字段
       */
      ignore: string;
      /**
       * 消息字段名
       */
      messageKey: string;
      /**
       * 消息格式模板
       */
      messageFormat: string;
      /**
       * 是否同步写入
       */
      sync: boolean;
    };
  };
}

/**
 * 检查是否传递了logger
 * @param pinoHttpProp - 传递的logger
 * @returns 如果传递了logger则返回true
 */
export function isPassedLogger(
  pinoHttpProp: any,
): pinoHttpProp is PassedLogger {
  return !!pinoHttpProp && 'logger' in pinoHttpProp;
}

/**
 * 参数提供者令牌
 */
export const PARAMS_PROVIDER_TOKEN = 'pino-params';
