import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';
import { ConfigService } from '../../config/config.service';

/**
 * 租户隔离策略枚举
 *
 * @enum {string}
 * @description 定义了多租户系统中数据隔离的两种策略:
 * - SCHEMA: 使用独立的数据库Schema来隔离不同租户的数据
 * - ROW: 在同一个Schema中使用行级安全性来隔离不同租户的数据
 */
export enum TenantIsolationStrategy {
  /** 使用独立Schema进行租户隔离 */
  SCHEMA = 'schema',
  /** 使用行级安全策略进行租户隔离 */
  ROW = 'row',
}

export enum SchemaError {
  SCHEMA_NOT_FOUND = 'SCHEMA_NOT_FOUND',
  SCHEMA_ALREADY_EXISTS = 'SCHEMA_ALREADY_EXISTS',
}

/**
 * 数据库服务
 *
 * 用于管理多租户数据库连接和租户隔离的服务类。
 * 实现了数据库初始化、租户schema创建、连接池管理等功能。
 */
@Injectable()
export class DatabaseService implements OnModuleInit {
  /** PostgreSQL 客户端实例 */
  private client: postgres.Sql;
  private db: any; // drizzle instance
  private isolationStrategy: TenantIsolationStrategy;
  public readonly query: any;

  /**
   * 构造函数
   * @param env - 配置服务,用于获取数据库连接配置
   */
  constructor(private env: ConfigService) {
    this.client = postgres({
      host: this.env.database.host,
      port: this.env.database.port,
      user: this.env.database.user,
      password: this.env.database.password,
      database: this.env.database.name,
      max: this.env.database.pool.max, // 最大连接数
      idle_timeout: this.env.database.pool.idle_timeout, // 空闲连接超时（秒）
      connect_timeout: this.env.database.pool.connect_timeout, // 连接超时（秒）
      max_lifetime: this.env.database.pool.max_lifetime, // 连接最大生命周期（秒）
    });

    // 创建单个 drizzle 实例
    this.db = drizzle(this.client);
    this.query = drizzle(this.client, { schema }).query;
    this.isolationStrategy =
      (this.env.database.isolationStrategy as TenantIsolationStrategy) ||
      TenantIsolationStrategy.ROW;
  }

  /**
   * 模块初始化钩子
   * 启用行级安全性
   */
  async onModuleInit() {
    // 创建自定义参数
    await this.client`
      DO $$ 
      BEGIN 
        PERFORM set_config('custom.app.current_tenant_id', '', false);
      EXCEPTION 
        WHEN undefined_object THEN
          PERFORM set_config('app.current_tenant_id', '', false);
      END $$;
    `;

    await this.client`
      ALTER DATABASE ${this.client(
        this.env.database.name
      )} SET row_security = on;
    `;

    if (this.isolationStrategy === TenantIsolationStrategy.ROW) {
      await this.client`CREATE SCHEMA IF NOT EXISTS public`;
    }
  }

  /**
   * 检查Schema是否存在
   */
  async checkSchemaExistsInDb(schemaName: string): Promise<boolean> {
    const result = await this.client`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.schemata 
        WHERE schema_name = ${this.client(schemaName)}
      );
    `;
    return result[0].exists;
  }

  /**
   * 创建租户Schema
   */
  async createTenantSchema(
    schema: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const exists = await this.checkSchemaExistsInDb(schema);
      if (exists) {
        return { success: false, error: SchemaError.SCHEMA_ALREADY_EXISTS };
      }

      await this.client`
        CREATE SCHEMA ${this.client(schema)};
        COMMENT ON SCHEMA ${this.client(schema)} 
        IS ${this.client(`Tenant Schema: ${schema}`)};
      `;

      await this.initializeSchemaStructure(schema);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 初始化Schema的表结构
   */
  private async initializeSchemaStructure(schemaName: string) {
    await this.client`
      SET search_path TO ${this.client(schemaName)};
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  }

  /**
   * 获取租户的数据库Schema名称
   * @private
   * @param tenantId - 租户ID
   * @returns 租户使用的数据库schema名称
   */
  private async getTenantSchema(tenantId: string): Promise<string> {
    const tenant = await this.getTenantInfo(tenantId);
    if (!tenant?.schema) {
      throw new Error('Tenant schema not found');
    }
    return tenant.schema;
  }

  /**
   * 获取数据库连接
   * @param tenantId - 租户ID
   * @returns 返回数据库连接实例
   * @throws {Error} 当Schema不存在时抛出错误
   */
  async getTenantDB(tenantId: string) {
    return await this.client.begin(async (transaction) => {
      await transaction`SET LOCAL app.current_tenant_id = ${transaction(
        tenantId
      )}`;

      if (this.isolationStrategy === TenantIsolationStrategy.SCHEMA) {
        const schemaName = await this.getTenantSchema(tenantId);

        // 检查Schema是否存在
        const schemaExists = await this.checkSchemaExistsInDb(schemaName);
        if (!schemaExists) {
          throw new Error(SchemaError.SCHEMA_NOT_FOUND);
        }

        // 设置搜索路径到租户的schema
        await transaction`SET LOCAL search_path TO ${transaction(schemaName)}`;
      }

      return this.db;
    });
  }

  /**
   * 设置当前租户上下文
   * 在数据库会话中设置当前租户ID
   * @param tenantId - 租户ID
   */
  async setTenantContext(tenantId: string) {
    await this.client`SET LOCAL app.current_tenant_id = ${this.client(
      tenantId
    )}`;
  }

  /**
   * 根据租户ID查询租户信息
   * @param tenantId - 租户的唯一标识符
   * @returns 返回查询到的租户信息，如果未找到则返回null
   */
  async getTenantInfo(tenantId: string) {
    return await this.query.tenants.findFirst({
      where: (tenants, { eq }) => eq(tenants.id, tenantId),
    });
  }
}
