import { Injectable } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TenantContextService } from '../services/tenant-context.service';

/**
 * 租户中间件
 *
 * 用于处理多租户请求的中间件类。
 * 从请求头中提取租户Schema并设置到租户上下文中。
 */
@Injectable()
export class TenantMiddleware {
  /**
   * 构造函数
   * @param tenantContext - 租户上下文服务,用于管理租户信息
   */
  constructor(private tenantContext: TenantContextService) {}

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

    // 添加详细的调试日志
    console.log('TenantMiddleware processing request:', {
      url: req.url,
      originalUrl: req.originalUrl,
      method: req.method,
      headers: req.headers,
      routePattern: (req as any).routerPath, // 获取路由模式
    });

    // 从请求头中获取租户Schema
    const schema = req.headers['x-tenant-schema'] as string;
    if (!schema) {
      throw new Error('Tenant schema is required');
    }

    // 验证 schema 格式，保证用户输入的schema格式正确
    const schemaRegex = /^t_[a-zA-Z0-9_]+$/;
    if (!schemaRegex.test(schema)) {
      throw new Error(
        'Invalid tenant schema format - must start with "t_" and contain only letters, numbers, and underscores',
      );
    }

    // 将租户Schema存入CLS中，便于在请求时获取租户Schema
    this.tenantContext.setTenantSchemaInCls(schema);
    await next();
  }
}
