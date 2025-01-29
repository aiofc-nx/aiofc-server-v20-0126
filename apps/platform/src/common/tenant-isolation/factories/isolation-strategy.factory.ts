import { Injectable } from '@nestjs/common';
import { SchemaIsolationStrategy } from '../strategies/schema.strategy';
import { RowIsolationStrategy } from '../strategies/row.strategy';
import { IsolationStrategy } from '../interfaces/isolation.interface';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class IsolationStrategyFactory {
  constructor(private readonly configService: ConfigService) {}

  async create(tenantId: string): Promise<IsolationStrategy> {
    const tenant = await this.getTenantInfo(tenantId);
    return tenant.isolationStrategy === 'schema'
      ? new SchemaIsolationStrategy()
      : new RowIsolationStrategy();
  }

  private async getTenantInfo(tenantId: string): Promise<any> {
    // 使用 tenantId 查询租户信息
    // 这里需要实现实际的数据库查询逻辑
    const query = `SELECT * FROM tenants WHERE id = '${tenantId}'`; // 示例查询
    console.log(query); // 添加这行以使用 query 变量
    return { isolationStrategy: 'schema' }; // 示例返回，需替换为实际实现
  }
}
