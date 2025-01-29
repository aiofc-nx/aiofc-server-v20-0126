import { z } from 'zod';
import {
  TenantStatus,
  TenantCategory,
} from '../../../database/schema/tenant.schema';

export const createTenantSchema = z.object({
  name: z
    .string()
    .min(2, '租户名称至少需要2个字符')
    .max(100, '租户名称不能超过100个字符'),
  schema: z
    .string()
    .min(3, '租户Schema标识至少需要3个字符')
    .max(20, '租户Schema标识不能超过20个字符')
    .regex(
      /^t_[a-zA-Z0-9_]+$/,
      '租户Schema标识必须以"t_"开头，且只能包含字母、数字和下划线',
    ),
  description: z.string().optional(),
  database: z.string().min(1, '数据库标识不能为空'),
  status: z.nativeEnum(TenantStatus).default(TenantStatus.ACTIVE),
  connection_string: z.string().optional(),
  organization_code: z
    .string()
    .min(18, '组织机构代码至少需要18个字符')
    .max(50, '组织机构代码不能超过50个字符')
    .optional(),
  organization_name: z
    .string()
    .max(200, '组织机构名称不能超过200个字符')
    .optional(),
  category: z.nativeEnum(TenantCategory).default(TenantCategory.OTHER),
});

export type CreateTenantDto = z.infer<typeof createTenantSchema>;

export const updateTenantSchema = createTenantSchema.partial();
export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
