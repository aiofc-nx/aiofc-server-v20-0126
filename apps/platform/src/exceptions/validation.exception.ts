import { ErrorCode } from '../common/constants/error-code.constant';
import { BadRequestException } from '@nestjs/common';

/**
 * 验证异常类
 *
 * 用于抛出带有自定义错误代码和消息的验证错误
 *
 * @class ValidationException
 * @extends {BadRequestException}
 *
 * @example
 * ```ts
 * throw new ValidationException(ErrorCode.V001, '用户名不能为空');
 * ```
 *
 * @param {ErrorCode} error - 错误代码,默认为 V000 (通用验证错误)
 * @param {string} [message] - 可选的错误消息。如果未提供,将使用错误代码对应的默认消息
 */
export class ValidationException extends BadRequestException {
  constructor(error: ErrorCode = ErrorCode.V000, message?: string) {
    super({ errorCode: error, message });
  }
}
