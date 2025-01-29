/**
 * 租户隔离策略枚举
 *
 * @enum {string}
 * @description 定义了多租户系统中数据隔离的两种策略:
 * - SCHEMA: 使用独立的数据库Schema来隔离不同租户的数据
 * - ROW: 在同一个Schema中使用行级安全性来隔离不同租户的数据
 */
export enum TenantIsolationStrategy {
  /** 使用独立Schema进行租户隔离 */
  SCHEMA = 'schema',
  /** 使用行级安全策略进行租户隔离 */
  ROW = 'row',
}

export enum TenantSchemaError {
  SCHEMA_NOT_FOUND = 'SCHEMA_NOT_FOUND',
  SCHEMA_ALREADY_EXISTS = 'SCHEMA_ALREADY_EXISTS',
}

export enum TenantIsolationError {
  INVALID_TENANT_ID = 'INVALID_TENANT_ID',
  SCHEMA_NOT_FOUND = 'SCHEMA_NOT_FOUND',
  SCHEMA_ALREADY_EXISTS = 'SCHEMA_ALREADY_EXISTS',
}
