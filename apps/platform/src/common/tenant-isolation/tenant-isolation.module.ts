import { Module } from '@nestjs/common';
import { IsolationStrategyFactory } from './factories/isolation-strategy.factory';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [
    IsolationStrategyFactory,
    {
      provide: 'ISOLATION_STRATEGY',
      useFactory: (factory: IsolationStrategyFactory) =>
        factory.create('default-tenant-id'),
      inject: [IsolationStrategyFactory],
    },
  ],
  exports: ['ISOLATION_STRATEGY'],
})
export class TenantIsolationModule {}
