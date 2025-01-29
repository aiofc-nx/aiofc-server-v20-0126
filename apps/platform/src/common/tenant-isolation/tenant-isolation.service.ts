import { Injectable } from '@nestjs/common';
import { IsolationStrategy } from './interfaces/isolation.interface';

@Injectable()
export class TenantIsolationService {
  constructor(private readonly isolationStrategy: IsolationStrategy) {}

  async execute<T>(tenantId: string, callback: () => Promise<T>): Promise<T> {
    return this.isolationStrategy.execute(tenantId, callback);
  }
}
