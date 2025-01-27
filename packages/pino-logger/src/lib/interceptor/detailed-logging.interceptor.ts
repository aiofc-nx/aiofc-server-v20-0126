import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Observable, catchError, tap, throwError, from, mergeMap } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { PinoLogger } from '../pino-logger';
import { randomUUID } from 'crypto';
import { performance } from 'perf_hooks';
import { loggingInterceptorConfig } from '../params.service';
import { Params } from '../interface/params';
import {
  FailedDependencyException,
  LockedException,
  MethodNotAllowedException,
  NotAcceptableException,
  PreconditionFailedException,
  PreconditionRequiredException,
  RequestTimeoutException,
  TooManyRequestsException,
} from '../exception/http-exception';

interface RequestUser {
  id: string;
  username: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: RequestUser;
  }
}

interface CacheOperation {
  type: 'get' | 'set' | 'del';
  key?: string;
  value?: any;
  timestamp: number;
  duration: number;
  success: boolean;
}

@Injectable()
export class DetailedLoggingInterceptor implements NestInterceptor {
  private readonly params: Params;

  constructor(
    private readonly cls: ClsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext('DetailedLoggingInterceptor');
    this.params = loggingInterceptorConfig; // 直接从配置中获取
  }

  /**
   * 获取追踪信息
   */
  private getTraceInfo(
    request: FastifyRequest,
  ): Record<string, any> | undefined {
    if (!this.params.trace?.enabled) {
      return undefined;
    }

    const { traceIdHeader, parentIdHeader } = this.params.trace;
    const headers = request.headers;
    const traceId =
      headers[traceIdHeader?.toLowerCase() || ''] ||
      headers['traceid'] ||
      headers['x-trace-id'] ||
      headers['x-traceid'] ||
      (request as any)._traceId;

    const spanId = (request as any)._spanId;

    // 使用 parentIdHeader 之前进行检查
    const parentId = parentIdHeader ? headers[parentIdHeader] : undefined;

    const now = new Date();
    const timestamp = now.toISOString(); // 使用 ISO 格式的时间戳

    const trace: Record<string, any> = {
      traceId,
      parentId,
      spanId,
      timestamp,
    };

    return trace;
  }

  /**
   * 获取性能指标
   */
  private getPerformanceMetrics(
    startTime: number,
  ): Record<string, any> | undefined {
    if (!this.params.trace?.timing) {
      return undefined;
    }

    const duration = Date.now() - startTime;
    const highResTime = performance.now() - startTime;

    return {
      duration,
      highResTime,
      timestamp: Date.now(),
      timeOrigin: performance.timeOrigin,
    };
  }

  /**
   * 是否需要采样
   */
  private shouldSample(): boolean {
    const sampleRate = this.params.trace?.sampleRate ?? 1;
    return Math.random() < sampleRate;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 采样控制
    if (!this.shouldSample()) {
      return next.handle();
    }

    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    // 生成 spanId 和 traceId 并存储在请求对象上
    const spanId = randomUUID();
    const traceId = randomUUID();
    (request as any)._spanId = spanId;
    (request as any)._traceId = traceId;

    // 使用 cls.run 包装整个请求处理过程
    return from(
      this.cls.run(async () => {
        // 跳过不需要记录的路径
        if (this.shouldSkipLogging(request)) {
          return next.handle();
        }

        // 记录请求信息
        this.logRequest(request);

        return next.handle().pipe(
          tap(async () => {
            // 等待响应完成
            await response.sent;
            const metrics = this.getPerformanceMetrics(startTime);
            this.logResponse(request, response, startTime, metrics);
          }),
          catchError((error) => {
            const metrics = this.getPerformanceMetrics(startTime);
            this.logError(error, request, response, startTime, metrics);
            return throwError(() => error);
          }),
        );
      }),
    ).pipe(mergeMap((observable) => observable));
  }

  /**
   * 判断是否需要跳过日志记录
   */
  private shouldSkipLogging(request: FastifyRequest): boolean {
    // 1. 检查是否是内部请求
    if (request.headers['x-internal-request']) {
      return true;
    }

    // 2. 检查是否在忽略路径列表中
    if (
      this.params.ignorePaths?.some((path) => {
        if (path instanceof RegExp) {
          return path.test(request.url);
        }
        return request.url.startsWith(path);
      })
    ) {
      return true;
    }

    // 3. 检查是否是健康检查等系统路径
    const systemPaths = [
      '/health',
      '/metrics',
      '/favicon.ico',
      '/_next',
      '/api-docs',
    ];
    if (systemPaths.some((path) => request.url.startsWith(path))) {
      return true;
    }

    // 4. 检查是否是静态资源
    if (
      request.url.startsWith('/static/') ||
      request.url.match(
        /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/,
      )
    ) {
      return true;
    }

    // 5. 检查是否已经记录过日志
    if (this.cls.get('loggedRequest')) {
      return true;
    }
    this.cls.set('loggedRequest', true);

    return false;
  }

  /**
   * 脱敏请求头
   */
  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sensitiveHeaders = this.params.sensitiveHeaders || []; // 确保不为 undefined
    return Object.entries(headers).reduce<Record<string, any>>(
      (acc, [key, value]) => {
        acc[key] = sensitiveHeaders.includes(key.toLowerCase()) ? '***' : value;
        return acc;
      },
      {},
    );
  }

  /**
   * 脱敏请求体
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;

    return Object.entries(body).reduce<Record<string, any>>(
      (acc, [key, value]) => {
        // 处理嵌套对象
        if (value && typeof value === 'object') {
          acc[key] = this.sanitizeBody(value);
        } else {
          acc[key] = (this.params.sensitiveFields || []).includes(
            key.toLowerCase(),
          )
            ? '***'
            : value;
        }
        return acc;
      },
      {},
    );
  }

  /**
   * 获取用户信息
   */
  private getUserInfo(
    request: FastifyRequest,
  ): Record<string, any> | undefined {
    const user = request.user;
    if (!user) return undefined;

    return {
      id: user.id,
      username: user.username,
      // 其他需要的用户信息
    };
  }

  /**
   * 获取路由信息
   */
  private getRouteInfo(request: FastifyRequest) {
    return {
      routeId: request.routeOptions?.url || request.url,
      params: request.params,
      query: request.query,
    };
  }

  /**
   * 记录请求信息
   */
  private logRequest(request: FastifyRequest): void {
    const traceInfo = this.getTraceInfo(request);

    const logDetails = {
      method: request.method,
      url: request.url,
      headers: this.sanitizeHeaders(request.headers),
      ip: request.ip,
      requestId: request.id,
      route: this.getRouteInfo(request),
      userAgent: request.headers['user-agent'],
      contentType: request.headers['content-type'],
      protocol: request.protocol,
      hostname: request.hostname,
      ...(this.params.logRequestBody && {
        body: this.sanitizeBody(request.body),
      }),
      ...(Object.keys(request.query || {}).length > 0
        ? { query: request.query }
        : {}),
      ...(Object.keys(request.params || {}).length > 0
        ? { params: request.params }
        : {}),
      traceInfo,
    };

    // 格式化日志输出
    const formattedLog = this.formatLog('info', 'HTTP Request', logDetails);
    this.logger.info(formattedLog);
  }

  /**
   * 记录响应信息
   */
  private logResponse(
    request: FastifyRequest,
    response: FastifyReply,
    startTime: number,
    metrics?: Record<string, any>,
  ): void {
    const duration = Date.now() - startTime;
    const traceInfo = this.getTraceInfo(request);
    const responseHeaders = response.getHeaders();

    // 获取租户信息
    const tenant =
      (request.headers['x-tenant-id'] as string) ||
      (request.headers['x-tenant-schema'] as string) ||
      'default';

    const logDetails = {
      method: request.method,
      url: request.url,
      statusCode: response.statusCode,
      duration: `${duration}ms`,
      headers: responseHeaders,
      ip: request.ip,
      requestId: request.id,
      tenant,
      traceInfo,
      metrics: metrics || {},
    };

    // 格式化日志输出
    const formattedLog = this.formatLog('info', 'HTTP Response', logDetails);
    this.logger.info(formattedLog);
  }

  /**
   * 获取错误类型
   */
  private getErrorType(error: Error): string {
    // HTTP 异常
    if (error instanceof HttpException) {
      // 4xx 客户端错误
      if (error instanceof BadRequestException) return 'BadRequest'; // 400
      if (error instanceof UnauthorizedException) return 'Unauthorized'; // 401
      if (error instanceof ForbiddenException) return 'Forbidden'; // 403
      if (error instanceof NotFoundException) return 'NotFound'; // 404
      if (error instanceof MethodNotAllowedException) return 'MethodNotAllowed'; // 405
      if (error instanceof NotAcceptableException) return 'NotAcceptable'; // 406
      if (error instanceof RequestTimeoutException) return 'RequestTimeout'; // 408
      if (error instanceof ConflictException) return 'Conflict'; // 409
      if (error instanceof PreconditionFailedException)
        return 'PreconditionFailed'; // 412
      if (error instanceof PayloadTooLargeException) return 'PayloadTooLarge'; // 413
      if (error instanceof UnsupportedMediaTypeException)
        return 'UnsupportedMediaType'; // 415
      if (error instanceof UnprocessableEntityException)
        return 'UnprocessableEntity'; // 422
      if (error instanceof LockedException) return 'Locked'; // 423
      if (error instanceof FailedDependencyException) return 'FailedDependency'; // 424
      if (error instanceof PreconditionRequiredException)
        return 'PreconditionRequired'; // 428
      if (error instanceof TooManyRequestsException) return 'TooManyRequests'; // 429

      // 5xx 服务器错误
      if (error instanceof InternalServerErrorException)
        return 'InternalServerError'; // 500
      if (error instanceof BadGatewayException) return 'BadGateway'; // 502
      if (error instanceof ServiceUnavailableException)
        return 'ServiceUnavailable'; // 503
      if (error instanceof GatewayTimeoutException) return 'GatewayTimeout'; // 504

      return 'HttpException';
    }

    // JavaScript 内置错误
    if (error instanceof TypeError) return 'TypeError'; // 类型错误
    if (error instanceof SyntaxError) return 'SyntaxError'; // 语法错误
    if (error instanceof ReferenceError) return 'ReferenceError'; // 引用错误
    if (error instanceof RangeError) return 'RangeError'; // 范围错误
    if (error instanceof URIError) return 'URIError'; // URI 错误
    if (error instanceof EvalError) return 'EvalError'; // Eval 错误

    // 数据库错误
    if (error.name === 'QueryFailedError') return 'DatabaseQueryError'; // 查询失败
    if (error.name === 'EntityNotFoundError') return 'DatabaseNotFound'; // 实体未找到
    if (error.name === 'TransactionFailedError') return 'TransactionError'; // 事务失败
    if (error.name === 'ConnectionError') return 'DatabaseConnectionError'; // 连接错误

    // 验证错误
    if (error.name === 'ValidationError') return 'ValidationError'; // 数据验证错误
    if (error.name === 'ConstraintViolationError') return 'ConstraintError'; // 约束违反

    // 业务逻辑错误
    if (error.name === 'BusinessError') return 'BusinessError'; // 通用业务错误
    if (error.name === 'DomainError') return 'DomainError'; // 领域错误
    if (error.name === 'InvalidOperationError') return 'InvalidOperation'; // 非法操作

    // 第三方服务错误
    if (error.name === 'AxiosError') return 'HttpClientError'; // HTTP 客户端错误
    if (error.name === 'TimeoutError') return 'ServiceTimeoutError'; // 服务超时
    if (error.name === 'NetworkError') return 'NetworkError'; // 网络错误

    // 认证授权错误
    if (error.name === 'TokenExpiredError') return 'TokenExpired'; // Token 过期
    if (error.name === 'JsonWebTokenError') return 'InvalidToken'; // Token 无效
    if (error.name === 'AuthenticationError') return 'AuthenticationError'; // 认证错误

    // 资源错误
    if (error.name === 'ResourceExhaustedError') return 'ResourceExhausted'; // 资源耗尽
    if (error.name === 'QuotaExceededError') return 'QuotaExceeded'; // 配额超限
    if (error.name === 'RateLimitError') return 'RateLimit'; // 速率限制

    // 默认错误类型
    return 'InternalError';
  }

  /**
   * 获取错误状态码
   */
  private getErrorCode(error: Error): number {
    if (error instanceof HttpException) {
      return error.getStatus();
    }
    return 500;
  }

  /**
   * 获取错误详情
   */
  private getErrorDetails(error: Error): Record<string, any> {
    const errorResponse =
      error instanceof HttpException ? error.getResponse() : null;

    return {
      type: this.getErrorType(error),
      code: this.getErrorCode(error),
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...(errorResponse &&
        typeof errorResponse === 'object' && { details: errorResponse }),
      // 添加额外的错误属性
      ...((error as any)['code'] && { errorCode: (error as any)['code'] }),
      ...((error as any)['cause'] && { cause: (error as any)['cause'] }),
      ...((error as any)['metadata'] && {
        metadata: (error as any)['metadata'],
      }),
    };
  }

  /**
   * 记录错误信息
   */
  private logError(
    error: Error,
    request: FastifyRequest,
    response: FastifyReply,
    startTime: number,
    metrics?: Record<string, any>,
  ): void {
    const duration = Date.now() - startTime;

    const logDetails = {
      method: request.method,
      url: request.url,
      statusCode: response.statusCode,
      duration: `${duration}ms`,
      error: this.getErrorDetails(error),
      ip: request.ip,
      requestId: request.id,
      user: this.getUserInfo(request),
      route: this.getRouteInfo(request),
      metrics: metrics || {},
    };

    // 格式化日志输出
    const formattedLog = this.formatLog('error', 'HTTP Error', logDetails);
    this.logger.error(formattedLog);
  }

  /**
   * 记录缓存操作
   */
  private logCacheOperation(
    type: 'get' | 'set' | 'del',
    key: string,
    value?: any,
    duration?: number,
    success = true,
  ): void {
    if (!this.params.trace?.cache?.enabled) {
      return;
    }

    const traceInfo = this.cls.get('traceInfo');
    if (!traceInfo?.cache) {
      return;
    }

    const operation: CacheOperation = {
      type,
      timestamp: Date.now(),
      duration: duration || 0,
      success,
    };

    if (this.params.trace.cache.logKeys) {
      operation['key'] = key;
    }

    if (this.params.trace.cache.logValues && value !== undefined) {
      operation['value'] = value;
    }

    traceInfo.cache.operations.push(operation);

    // 更新缓存命中/未命中计数
    if (type === 'get') {
      if (success && value !== undefined) {
        traceInfo.cache.hits++;
      } else {
        traceInfo.cache.misses++;
      }
    }
  }

  private formatLog(level: string, message: string, details: any): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${JSON.stringify(details, null, 2)}`;
  }
}
