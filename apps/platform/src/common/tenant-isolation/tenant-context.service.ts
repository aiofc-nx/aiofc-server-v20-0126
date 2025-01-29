import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

/**
 * 租户上下文服务
 *
 * 用于管理多租户系统中的租户Schema信息。
 * 这里的Schema 是指租户在数据库中使用的Schema名称。
 * 我们使用CLS来存储租户Schema信息，便于在请求时获取租户Schema。而不是从数据库中获取。
 * 该服务的作用域为请求级别(REQUEST),确保每个请求都有其独立的租户上下文。
 */
@Injectable()
export class TenantContextService {
  // 租户Schema在CLS中的键名
  private readonly TENANT_SCHEMA_KEY = 'tenantSchema';
  private readonly TENANT_ID_KEY = 'tenantId';

  constructor(private readonly cls: ClsService) {}

  /**
   * 设置当前租户Schema到CLS中
   * @param schema - 要设置的租户Schema标识符
   */
  setTenantSchemaInCls(schema: string) {
    this.cls.set(this.TENANT_SCHEMA_KEY, schema);
  }

  /**
   * 获取当前租户Schema
   * @returns 当前租户的Schema标识符
   * @throws {Error} 如果租户上下文未设置则抛出错误
   */
  getTenantSchemaFromCls(): string {
    const schema = this.cls.get(this.TENANT_SCHEMA_KEY);
    if (!schema) {
      throw new Error('Tenant schema context not set');
    }
    return schema;
  }

  /**
   * 设置当前租户ID到CLS中
   * @param tenantId - 要设置的租户ID
   */
  setTenantId(tenantId: string) {
    this.cls.set(this.TENANT_ID_KEY, tenantId);
  }

  /**
   * 获取当前租户ID
   * @returns 当前租户的ID
   * @throws {Error} 如果租户ID未设置则抛出错误
   */
  getTenantId(): string {
    const tenantId = this.cls.get(this.TENANT_ID_KEY);
    if (!tenantId) {
      throw new Error('Tenant ID not set in context');
    }
    return tenantId;
  }
}
