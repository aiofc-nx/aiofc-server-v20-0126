import { IsolationStrategy } from '../interfaces/isolation.interface';
import { TenantIsolationError } from '../tenant-isolation.constant';

export class RowIsolationStrategy implements IsolationStrategy {
  async initialize() {
    // Row级别隔离初始化逻辑
  }

  async execute<T>(tenantId: string, callback: () => Promise<T>): Promise<T> {
    if (!tenantId) {
      throw new Error(TenantIsolationError.INVALID_TENANT_ID);
    }
    // 使用行级安全策略执行操作
    return callback();
  }
}
