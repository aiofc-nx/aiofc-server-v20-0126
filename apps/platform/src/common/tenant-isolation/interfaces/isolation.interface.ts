export interface IsolationStrategy {
  initialize(): Promise<void>;
  execute<T>(tenantId: string, callback: () => Promise<T>): Promise<T>;
}
