import { Injectable, Inject, Scope } from '@nestjs/common';
import pino from 'pino';
import { ClsService } from 'nestjs-cls';

import {
  isPassedLogger,
  Params,
  PARAMS_PROVIDER_TOKEN,
} from './interface/params';

/**
 * 从pino.Logger中选取的日志记录方法类型
 */
type PinoMethods = Pick<
  pino.Logger,
  'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
>;

/**
 * 日志记录函数类型定义
 *
 * @remarks
 * 这是对pino.LogFn的自定义实现,允许方法重写。支持两种调用方式:
 * 1. 传入消息字符串和可选参数
 * 2. 传入对象、可选消息字符串和可选参数
 *
 * @example
 * ```typescript
 * // 方式1: 消息字符串
 * logger.trace('用户登录', user.id);
 *
 * // 方式2: 对象 + 消息
 * logger.trace({ userId: user.id }, '用户登录');
 * ```
 */
type LoggerFn =
  | ((msg: string, ...args: any[]) => void)
  | ((obj: object, msg?: string, ...args: any[]) => void);

/**
 * 存储上下文外的全局logger实例
 */
let outOfContext: pino.Logger | undefined;

/**
 * 重置测试环境下的上下文和根logger
 * @internal 仅用于测试
 */
export function __resetOutOfContextForTests() {
  outOfContext = undefined;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore reset root for tests only
  PinoLogger.root = undefined;
}

/**
 * Pino日志记录器的NestJS封装类
 *
 * @remarks
 * 提供了以下功能:
 * - 支持请求作用域的日志上下文
 * - 自动注入上下文信息
 * - 错误对象的特殊处理
 * - 支持动态绑定额外字段
 *
 * @example
 * ```typescript
 * // 基础用法
 * @Injectable()
 * class UserService {
 *   constructor(private logger: PinoLogger) {
 *     this.logger.setContext('UserService');
 *   }
 *
 *   async createUser() {
 *     this.logger.info('创建新用户');
 *     // 输出: {"context": "UserService", "msg": "创建新用户"}
 *   }
 * }
 * ```
 */
@Injectable({ scope: Scope.TRANSIENT })
export class PinoLogger implements PinoMethods {
  /**
   * 根logger实例,可用于运行时更改参数
   * @remarks
   * 仅当LoggerParams中useExisting为false时可用
   */
  static readonly root: pino.Logger;

  /**
   * 当前logger的上下文名称
   */
  protected context = '';

  /**
   * 上下文字段的键名
   */
  protected readonly contextName: string;

  /**
   * 错误对象的键名
   */
  protected readonly errorKey: string = 'err';

  /**
   * 创建一个新的PinoLogger实例
   *
   * @param pinoHttp - Pino HTTP配置参数或已存在的logger实例
   * @param renameContext - 自定义上下文字段名称
   * @param cls - 请求作用域服务实例
   *
   * @remarks
   * 构造函数会根据传入的pinoHttp参数初始化logger实例:
   * - 如果是数组,则作为pino构造函数的参数传入
   * - 如果是已存在的logger实例,则直接使用
   * - 如果包含stream属性,则使用pino(options, stream)方式构造
   * - 其他情况下直接传入pino构造函数
   */
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) { pinoHttp, renameContext }: Params,
    private readonly cls: ClsService,
  ) {
    // 如果pinoHttp是对象且包含customAttributeKeys属性，则使用其作为错误键
    if (
      typeof pinoHttp === 'object' &&
      'customAttributeKeys' in pinoHttp &&
      typeof pinoHttp.customAttributeKeys !== 'undefined'
    ) {
      this.errorKey = pinoHttp.customAttributeKeys.err ?? 'err';
    }

    // 如果outOfContext未定义，则根据pinoHttp参数初始化
    if (!outOfContext) {
      if (Array.isArray(pinoHttp)) {
        outOfContext = pino(...pinoHttp);
      } else if (isPassedLogger(pinoHttp)) {
        outOfContext = pinoHttp.logger;
      } else if (
        typeof pinoHttp === 'object' &&
        'stream' in pinoHttp &&
        typeof pinoHttp.stream !== 'undefined'
      ) {
        outOfContext = pino(pinoHttp, pinoHttp.stream);
      } else {
        outOfContext = pino(pinoHttp);
      }
    }

    // 设置上下文字段名称
    this.contextName = renameContext || 'context';
  }

  /**
   * 获取当前请求作用域的logger实例
   */
  get logger(): pino.Logger {
    return this.cls.get('logger') || outOfContext!;
  }

  /**
   * 记录追踪级别的日志
   */
  trace(msg: string, ...args: any[]): void;
  trace(obj: unknown, msg?: string, ...args: any[]): void;
  trace(...args: Parameters<LoggerFn>) {
    this.call('trace', ...args);
  }

  /**
   * 记录调试级别的日志
   */
  debug(msg: string, ...args: any[]): void;
  debug(obj: unknown, msg?: string, ...args: any[]): void;
  debug(...args: Parameters<LoggerFn>) {
    this.call('debug', ...args);
  }

  /**
   * 记录信息级别的日志
   */
  info(msg: string, ...args: any[]): void;
  info(obj: unknown, msg?: string, ...args: any[]): void;
  info(...args: Parameters<LoggerFn>) {
    this.call('info', ...args);
  }

  /**
   * 记录警告级别的日志
   */
  warn(msg: string, ...args: any[]): void;
  warn(obj: unknown, msg?: string, ...args: any[]): void;
  warn(...args: Parameters<LoggerFn>) {
    this.call('warn', ...args);
  }

  /**
   * 记录错误级别的日志
   */
  error(msg: string, ...args: any[]): void;
  error(obj: unknown, msg?: string, ...args: any[]): void;
  error(...args: Parameters<LoggerFn>) {
    this.call('error', ...args);
  }

  /**
   * 记录致命错误级别的日志
   */
  fatal(msg: string, ...args: any[]): void;
  fatal(obj: unknown, msg?: string, ...args: any[]): void;
  fatal(...args: Parameters<LoggerFn>) {
    this.call('fatal', ...args);
  }

  /**
   * 设置logger的上下文名称
   * @param value - 上下文名称
   */
  setContext(value: string) {
    this.context = value;
  }

  /**
   * 为当前请求作用域的logger绑定额外字段
   * @param fields - 要绑定的字段对象
   * @throws 如果在请求作用域外调用则抛出错误
   */
  assign(fields: pino.Bindings) {
    const logger = this.cls.get('logger');
    if (!logger) {
      throw new Error(
        `${PinoLogger.name}: unable to assign extra fields out of request scope`,
      );
    }
    this.cls.set('logger', logger.child(fields));
    const responseLogger = this.cls.get('responseLogger');
    if (responseLogger) {
      responseLogger.setBindings(fields);
    }
  }

  /**
   * 处理日志记录的核心方法
   *
   * @param method - 日志级别
   * @param args - 日志参数
   *
   * @remarks
   * 该方法会:
   * 1. 注入上下文信息
   * 2. 特殊处理Error对象
   * 3. 合并对象参数
   */
  protected call(method: pino.Level, ...args: Parameters<LoggerFn>) {
    if (this.context) {
      if (isFirstArgObject(args)) {
        const firstArg = args[0];
        if (firstArg instanceof Error) {
          args = [
            Object.assign(
              { [this.contextName]: this.context },
              { [this.errorKey]: firstArg },
            ),
            ...args.slice(1),
          ];
        } else {
          args = [
            Object.assign({ [this.contextName]: this.context }, firstArg),
            ...args.slice(1),
          ];
        }
      } else {
        args = [{ [this.contextName]: this.context }, ...args];
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore args are union of tuple types
    this.logger[method](...args);
  }
}

/**
 * 判断参数是否为对象类型
 *
 * @param args - 日志参数
 * @returns 如果第一个参数是对象则返回true
 */
function isFirstArgObject(
  args: Parameters<LoggerFn>,
): args is [obj: object, msg?: string, ...args: any[]] {
  return typeof args[0] === 'object';
}
