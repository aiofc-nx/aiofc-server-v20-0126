/** 标记路由为公开访问(无需认证) */
export const IS_PUBLIC = 'isPublic';

/** 标记路由为可选认证 */
export const IS_AUTH_OPTIONAL = 'isAuthOptional';

/**
 * 环境枚举
 * @enum {string}
 */
export enum Environment {
  /** 本地环境 */
  LOCAL = 'local',
  /** 开发环境 */
  DEVELOPMENT = 'development',
  /** 预发布环境 */
  STAGING = 'staging',
  /** 生产环境 */
  PRODUCTION = 'production',
  /** 测试环境 */
  TEST = 'test',
}

/**
 * 日志服务枚举
 * @enum {string}
 */
export enum LogService {
  /** 控制台日志 */
  CONSOLE = 'console',
  /** Google Cloud Logging 服务 */
  GOOGLE_LOGGING = 'google_logging',
  /** AWS CloudWatch 日志服务 */
  AWS_CLOUDWATCH = 'aws_cloudwatch',
}

/**
 * 排序方向枚举
 * @enum {string}
 */
export enum Order {
  /** 升序 */
  ASC = 'ASC',
  /** 降序 */
  DESC = 'DESC',
}

/** 需要在日志中隐藏的敏感信息路径 */
export const loggingRedactPaths = [
  'req.headers.authorization',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.email',
  'req.body.password',
  'req.body.oldPassword',
];

/** 默认分页大小 */
export const DEFAULT_PAGE_LIMIT = 10;

/** 默认当前页码 */
export const DEFAULT_CURRENT_PAGE = 1;

/** 系统用户ID */
export const SYSTEM_USER_ID = 'system';
