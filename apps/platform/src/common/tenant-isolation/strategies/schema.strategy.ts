import { IsolationStrategy } from '../interfaces/isolation.interface';
import { TenantIsolationError } from '../tenant-isolation.constant';

export class SchemaIsolationStrategy implements IsolationStrategy {
  async initialize() {
    // Schema初始化逻辑
  }

  async execute<T>(tenantId: string, callback: () => Promise<T>): Promise<T> {
    if (!tenantId) {
      throw new Error(TenantIsolationError.INVALID_TENANT_ID);
    }
    // 切换Schema并执行操作
    return callback();
  }
}
