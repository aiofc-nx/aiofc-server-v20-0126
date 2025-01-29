import { IsolationStrategy } from '../interfaces/isolation.interface';

export abstract class BaseIsolationStrategy implements IsolationStrategy {
  abstract initialize(): Promise<void>;
  abstract execute<T>(tenantId: string, callback: () => Promise<T>): Promise<T>;
}
