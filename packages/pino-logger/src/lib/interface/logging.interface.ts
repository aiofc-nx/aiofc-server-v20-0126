// 定义链路追踪配置接口
export interface TraceConfig {
  enabled: boolean; // 启用链路追踪功能
  traceIdHeader: string; // 追踪ID的请求头名称
  parentIdHeader: string; // 父追踪ID的请求头名称
  cache: {
    enabled: boolean; // 启用缓存追踪功能
    logKeys: boolean; // 记录缓存键
    logValues: boolean; // 记录缓存值
  };
}

// 定义日志传输选项的接口
export interface LoggerTransportOptions {
  minimumLevel: 'info' | 'debug' | 'error' | 'warn' | 'fatal'; // 日志级别
  singleLine: boolean; // 是否单行输出
  translateTime: string; // 时间戳格式
  colorize: boolean; // 是否启用彩色输出
  levelFirst: boolean; // 级别信息是否在前
  ignore: string; // 忽略的字段
  messageKey: string; // 消息字段名
  messageFormat: string; // 消息格式模板
  sync: boolean; // 是否同步写入
}

// 定义日志传输的接口
export interface LoggerTransport {
  target: string; // 传输目标
  options: LoggerTransportOptions; // 传输选项
}

// 定义日志记录过滤配置接口
export interface LoggerRecordingFilterConfig {
  ignorePaths: string[]; // 不记录日志的路径列表
  sensitiveHeaders: string[]; // 需要脱敏的请求头列表
  sensitiveFields: string[]; // 需要脱敏的字段列表
  logRequestBody: boolean; // 是否记录请求体
  logResponseBody: boolean; // 是否记录响应体
}
