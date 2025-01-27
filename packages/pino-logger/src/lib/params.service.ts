import {
  LoggerRecordingFilterConfig,
  LoggerTransport,
  TraceConfig,
} from './interface/logging.interface';

/**
 * 链路追踪配置对象
 *
 * @description 用于配置分布式链路追踪的相关参数,实现请求链路的全链路追踪功能
 *
 * @property enabled - 是否启用链路追踪功能,true表示启用
 * @property traceIdHeader - 追踪ID的请求头名称,用于在请求间传递追踪标识
 * @property parentIdHeader - 父追踪ID的请求头名称,用于构建请求调用链关系
 * @property cache - 缓存追踪相关配置
 * @property cache.enabled - 是否启用缓存操作的追踪,true表示启用
 * @property cache.logKeys - 是否记录缓存操作的键名,true表示记录
 * @property cache.logValues - 是否记录缓存操作的值,false表示不记录以节省空间
 */
export const traceConfig: TraceConfig = {
  enabled: true,
  traceIdHeader: 'x-trace-id',
  parentIdHeader: 'x-parent-id',
  cache: {
    enabled: true,
    logKeys: true,
    logValues: false,
  },
};

// 定义独立的日志传输配置对象
export const loggerTransportConfig: LoggerTransport = {
  target: 'pino-pretty',
  options: {
    minimumLevel: 'info',
    singleLine: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
    colorize: true,
    levelFirst: true,
    ignore: 'pid,hostname',
    messageKey: 'msg',
    messageFormat: '{msg}',
    sync: true,
  },
};

export const loggerRecordingFilterConfig: LoggerRecordingFilterConfig = {
  ignorePaths: ['/health', '/metrics', '/favicon.ico'],
  sensitiveHeaders: ['authorization', 'cookie', 'password', 'x-api-key'],
  sensitiveFields: ['password', 'token', 'secret', 'key'],
  logRequestBody: true,
  logResponseBody: false,
};

export const loggingInitConfig = {
  pinoHttp: {
    level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
    transport:
      process.env['NODE_ENV'] === 'development'
        ? loggerTransportConfig
        : undefined,
  },
  ...traceConfig,
  ...loggerRecordingFilterConfig,
};

export const loggingInterceptorConfig = {
  ...loggerRecordingFilterConfig,
  ...traceConfig,
  ...loggerTransportConfig,
};
