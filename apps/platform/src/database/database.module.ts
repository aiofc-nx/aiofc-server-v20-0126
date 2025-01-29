import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseConnectionService } from '../common/database/database-connection.service';

@Module({
  providers: [DatabaseService, DatabaseConnectionService],
  exports: [DatabaseService, DatabaseConnectionService],
})
export class DatabaseModule {}
