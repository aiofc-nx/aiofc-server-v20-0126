import { Injectable, ConflictException } from '@nestjs/common';
import {
  tenantTable,
  NewTenant,
  Tenant,
} from '../../database/schema/tenant.schema';
import { eq, and, not, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { CreateTenantDto } from './dto/tenant.dto';
import { cleanUpdateData, cleanCreateData } from '../../utils/db-helpers';

/**
 * 租户服务类
 * 提供租户相关的增删改查等操作
 *
 * @example
 * ```ts
 * const tenantService = new TenantService(db);
 * const tenant = await tenantService.create({
 *   code: 'TEST',
 *   name: '测试租户'
 * });
 * ```
 */
@Injectable()
export class TenantService {
  constructor(private db: DatabaseService) {}

  /**
   * 检查租户Schema标识是否已存在
   * @param schema - 租户Schema标识
   * @param excludeId - 需要排除的租户ID(用于更新场景)
   * @throws {ConflictException} 当租户Schema标识已存在时抛出异常
   *
   * @example
   * ```ts
   * await tenantService.checkSchemaExists('t_test');
   * ```
   */
  private async checkSchemaExists(
    schema: string,
    excludeId?: string
  ): Promise<void> {
    const db = await this.db.getTenantDB('system');
    const query = excludeId
      ? and(eq(tenantTable.schema, schema), not(eq(tenantTable.id, excludeId)))
      : eq(tenantTable.schema, schema);

    const [existing] = await db.select().from(tenantTable).where(query);

    if (existing) {
      throw new ConflictException(`租户标识 '${schema}' 已存在`);
    }
  }

  /**
   * 创建新租户
   * @param data - 租户创建数据
   * @returns 创建的租户信息
   *
   * @example
   * ```ts
   * const tenant = await tenantService.create({
   *   schema: 'TEST',
   *   name: '测试租户'
   * });
   * ```
   */
  async create(data: CreateTenantDto): Promise<Tenant> {
    await this.checkSchemaExists(data.schema);

    const db = await this.db.getTenantDB('system');
    const cleanedData = cleanCreateData(data);

    const [tenant] = await db
      .insert(tenantTable)
      .values({
        ...cleanedData,
        tenantId: sql`gen_random_uuid()`,
      })
      .returning();

    return tenant;
  }

  /**
   * 根据ID查找租户
   * @param id - 租户ID
   * @returns 租户信息，如果不存在则返回null
   *
   * @example
   * ```ts
   * const tenant = await tenantService.findById('123e4567-e89b-12d3-a456-426614174000');
   * ```
   */
  async findById(id: string): Promise<Tenant | null> {
    const db = await this.db.getTenantDB('system');
    const [tenant] = await db
      .select()
      .from(tenantTable)
      .where(
        and(eq(tenantTable.id, id), sql`${tenantTable.deletedAt} IS NULL`)
      );
    return tenant || null;
  }

  /**
   * 获取所有未删除的租户列表
   * @returns 租户列表
   *
   * @example
   * ```ts
   * const tenants = await tenantService.findAll();
   * ```
   */
  async findAll(): Promise<Tenant[]> {
    const db = await this.db.getTenantDB('system');
    return db
      .select()
      .from(tenantTable)
      .where(sql`${tenantTable.deletedAt} IS NULL`);
  }

  /**
   * 更新租户信息
   * @param id - 租户ID
   * @param data - 需要更新的租户数据
   * @returns 更新后的租户信息，如果租户不存在则返回null
   *
   * @example
   * ```ts
   * const updatedTenant = await tenantService.update('123e4567-e89b-12d3-a456-426614174000', {
   *   name: '更新后的租户名称'
   * });
   * ```
   */
  async update(id: string, data: Partial<NewTenant>): Promise<Tenant | null> {
    const updateData = cleanUpdateData(data);

    if (updateData.schema) {
      await this.checkSchemaExists(updateData.schema, id);
    }

    const db = await this.db.getTenantDB('system');
    const [tenant] = await db
      .update(tenantTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(tenantTable.id, id))
      .returning();
    return tenant || null;
  }

  /**
   * 软删除租户
   * @param id - 租户ID
   * @returns 是否删除成功
   *
   * @example
   * ```ts
   * const isDeleted = await tenantService.delete('123e4567-e89b-12d3-a456-426614174000');
   * ```
   */
  async delete(id: string): Promise<boolean> {
    const db = await this.db.getTenantDB('system');
    const [tenant] = await db
      .update(tenantTable)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tenantTable.id, id), sql`${tenantTable.deletedAt} IS NULL`))
      .returning();
    return !!tenant;
  }

  /**
   * 强制删除租户（物理删除）
   * @param id - 租户ID
   * @returns 是否删除成功
   *
   * @example
   * ```ts
   * const isDeleted = await tenantService.forceDelete('123e4567-e89b-12d3-a456-426614174000');
   * ```
   */
  async forceDelete(id: string): Promise<boolean> {
    const db = await this.db.getTenantDB('system');
    const [tenant] = await db
      .delete(tenantTable)
      .where(eq(tenantTable.id, id))
      .returning();
    return !!tenant;
  }

  /**
   * 恢复已删除的租户
   * @param id - 租户ID
   * @returns 恢复后的租户信息，如果租户不存在则返回null
   *
   * @example
   * ```ts
   * const restoredTenant = await tenantService.restore('123e4567-e89b-12d3-a456-426614174000');
   * ```
   */
  async restore(id: string): Promise<Tenant | null> {
    const db = await this.db.getTenantDB('system');
    const [tenant] = await db
      .update(tenantTable)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(tenantTable.id, id), sql`${tenantTable.deletedAt} IS NOT NULL`)
      )
      .returning();
    return tenant || null;
  }
}
