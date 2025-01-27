import { ErrorDetailDto } from '../dto/error-detail.dto';
import { ErrorDto } from '../dto/error.dto';
import { constraintErrors } from '../constants/constraint-errors';
import { ErrorCode } from '../constants/error-code.constant';
import { ValidationException } from '../../exceptions/validation.exception';
import { I18nTranslations } from '../../generated/i18n.generated';
import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { Logger } from '@aiofc/pino-logger';
import { PostgresError } from 'postgres';
import { FastifyReply } from 'fastify';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import pino from 'pino';
import { PinoLogger } from '@aiofc/pino-logger';
import { ClsService } from 'nestjs-cls';

// 扩展 FastifyRequest 类型
declare module 'fastify' {
  interface FastifyRequest {
    i18nContext: I18nContext<I18nTranslations>;
  }
}

type ErrorKeys = {
  [K in keyof I18nTranslations]: K;
}[keyof I18nTranslations];

/**
 * 全局异常过滤器
 *
 * 负责处理应用程序中所有未捕获的异常,将其转换为标准的错误响应格式
 *
 * 主要功能:
 * - 处理各种类型的异常并转换为统一的错误响应格式
 * - 支持国际化错误消息
 * - 在开发环境下提供详细的错误信息
 * - 记录错误日志
 *
 * 支持的异常类型:
 * - UnprocessableEntityException: 处理请求实体验证错误
 * - ValidationException: 处理自定义验证异常
 * - HttpException: 处理标准的HTTP异常
 * - PostgresError: 处理Postgres数据库错误
 * - Error: 处理其他通用错误
 */
@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  private debug = false;
  private readonly logger: Logger;

  constructor(
    protected readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly cls: ClsService,
  ) {
    super(httpAdapterHost.httpAdapter);
    this.logger = new Logger(
      new PinoLogger(
        {
          pinoHttp: pino({ name: 'GlobalExceptionFilter' }),
          sensitiveHeaders: [
            'authorization',
            'cookie',
            'password',
            'x-api-key',
          ],
          sensitiveFields: ['password', 'token', 'secret', 'key'],
          logRequestBody: true,
          logResponseBody: false,
        },
        this.cls,
      ),
      {
        renameContext: 'context',
        sensitiveHeaders: ['authorization', 'cookie', 'password', 'x-api-key'],
        sensitiveFields: ['password', 'token', 'secret', 'key'],
        logRequestBody: true,
        logResponseBody: false,
      },
    );
  }

  /**
   * 捕获并处理异常的主要方法
   *
   * @param exception - 捕获到的异常对象
   * @param host - 提供请求/响应上下文的参数主机
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    this.debug = false;

    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof ValidationException) {
      error = this.handleValidationException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else if (exception instanceof PostgresError) {
      error = this.handlePostgresError(exception);
    } else {
      error = this.handleError(exception);
    }

    if (error.message) {
      try {
        error.message = this.i18n.translate(
          `errors.${error.message}` as ErrorKeys,
          {
            defaultValue: error.message,
          },
        );
      } catch (e) {
        this.logger.error('Translation failed:', e);
      }
    }

    if (this.debug) {
      error.stack = exception.stack;
      error.trace = exception;
      this.logger.debug(error);
    }

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(response, error, error.statusCode);
  }

  /**
   * 处理实体验证异常
   *
   * 当请求负载验证失败时触发,例如:
   * - 必填字段缺失
   * - 字段格式不正确
   * - 字段值不符合约束条件
   *
   * @param exception - UnprocessableEntityException异常对象
   * @returns 标准化的错误响应对象
   */
  private handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ): ErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: 'Validation failed',
      details: this.extractValidationErrorDetails(r.message),
    };

    this.logger.debug(exception);

    return errorRes;
  }

  /**
   * 处理自定义验证异常
   *
   * @param exception - ValidationException异常对象
   * @returns 标准化的错误响应对象
   */
  private handleValidationException(exception: ValidationException): ErrorDto {
    const r = exception.getResponse() as {
      errorCode: ErrorCode;
      message: string;
    };
    const statusCode = exception.getStatus();

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      errorCode:
        Object.keys(ErrorCode)[Object.values(ErrorCode).indexOf(r.errorCode)],
      message:
        r.message ||
        this.i18n.t(r.errorCode as unknown as keyof I18nTranslations),
    };

    this.logger.debug(exception);

    return errorRes;
  }

  /**
   * 处理HTTP异常
   *
   * @param exception - HttpException异常对象
   * @returns 标准化的错误响应对象
   */
  private handleHttpException(exception: HttpException): ErrorDto {
    const statusCode = exception.getStatus();
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: exception.message,
    };

    this.logger.debug(exception);

    return errorRes;
  }

  /**
   * 处理 Postgres 数据库错误
   */
  private handlePostgresError(error: PostgresError): ErrorDto {
    const status = error.code?.startsWith('23')
      ? HttpStatus.CONFLICT // 约束违反错误
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status],
      message: this.getPostgresErrorMessage(error),
    };

    this.logger.error(error);
    return errorRes;
  }

  private getPostgresErrorMessage(error: PostgresError): string {
    // 首先检查是否是唯一约束错误
    if (error.code === '23505') {
      // 从错误详情中获取约束名称
      const constraintName = error.detail?.match(/^Key \((.*?)\)=/)?.[1] || '';
      // 查找对应的错误消息键
      const messageKey = constraintErrors[constraintName];
      if (messageKey) {
        return this.i18n.t(messageKey);
      }
    }

    // 默认错误处理
    switch (error.code) {
      case '23505': // 未匹配到具体约束的唯一约束违反
        return this.i18n.t('errors.duplicate_entry' as ErrorKeys);
      case '23503': // 外键约束违反
        return this.i18n.t('errors.foreign_key_violation' as ErrorKeys);
      case '23502': // 非空约束违反
        return this.i18n.t('errors.not_null_violation' as ErrorKeys);
      default:
        return this.i18n.t('errors.database_error' as ErrorKeys);
    }
  }

  /**
   * 处理通用错误
   *
   * 处理所有其他未明确分类的错误
   *
   * @param error - Error异常对象
   * @returns 标准化的错误响应对象
   */
  private handleError(error: Error): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error?.message || 'An unexpected error occurred',
    };

    this.logger.error(error);

    return errorRes;
  }

  /**
   * 从验证错误数组中提取错误详情
   *
   * 递归处理嵌套的验证错误,生成扁平化的错误详情数组
   *
   * @param errors - 验证错误数组
   * @returns 错误详情数组
   */
  private extractValidationErrorDetails(
    errors: ValidationError[],
  ): ErrorDetailDto[] {
    const extractErrors = (
      error: ValidationError,
      parentProperty = '',
    ): ErrorDetailDto[] => {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      const currentErrors: ErrorDetailDto[] = Object.entries(
        error.constraints || {},
      ).map(([code, message]) => ({
        property: propertyPath,
        code,
        message,
      }));

      const childErrors: ErrorDetailDto[] =
        error.children?.flatMap((childError) =>
          extractErrors(childError, propertyPath),
        ) || [];

      return [...currentErrors, ...childErrors];
    };

    return errors.flatMap((error) => extractErrors(error));
  }
}
