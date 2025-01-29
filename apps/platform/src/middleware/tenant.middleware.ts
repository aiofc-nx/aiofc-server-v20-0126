import { Injectable } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TenantContextService } from '../common/tenant-isolation/tenant-context.service';
// import { ConfigService } from '../config/config.service';

@Injectable()
export class TenantMiddleware {
  constructor(private readonly tenantContext: TenantContextService) {}

  /**
   * 中间件处理函数
   *
   * @param req - Fastify请求对象
   * @param _reply - Fastify响应对象
   * @param next - 调用下一个中间件的函数
   * @throws {Error} 当请求头中没有租户Schema或格式不正确时抛出错误
   */
  async use(req: FastifyRequest, _reply: FastifyReply, next: () => void) {
    const originalUrl = req.originalUrl || req.url;

    // 检查是否为需要排除的路径
    const excludedPaths = [
      '/',
      '/api',
      '/health',
      '/docs',
      '/swagger',
      '/tenants',
    ];

    // 检查是否以 /api/ 或 /tenants/ 开头
    if (
      originalUrl.startsWith('/api/') ||
      originalUrl.startsWith('/tenants/')
    ) {
      return next();
    }

    // 检查是否完全匹配排除路径
    if (excludedPaths.includes(originalUrl)) {
      return next();
    }

    const schema = req.headers['x-tenant-schema'] as string;
    if (!schema) {
      _reply.status(400).send({ message: 'Tenant schema is required' });
      return;
    }

    // 验证 Schema 格式
    if (!/^t_[a-zA-Z0-9_]+$/.test(schema)) {
      _reply.status(400).send({ message: 'Invalid tenant schema format' });
      return;
    }

    // 将租户 Schema 存入 CLS 中
    this.tenantContext.setTenantSchemaInCls(schema);
    next();
  }
}
