import postgres from 'postgres';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class DatabaseConnectionService {
  private client: postgres.Sql;

  constructor(private configService: ConfigService) {
    this.client = postgres({
      host: this.configService.database.host,
      port: this.configService.database.port,
      user: this.configService.database.user,
      password: this.configService.database.password,
      database: this.configService.database.name,
      max: this.configService.database.pool.max,
      idle_timeout: this.configService.database.pool.idle_timeout,
      connect_timeout: this.configService.database.pool.connect_timeout,
      max_lifetime: this.configService.database.pool.max_lifetime,
    });
  }

  getConnection(): postgres.Sql {
    return this.client;
  }
}
