import { HttpException } from '@nestjs/common';

// 添加自定义异常类
export class TooManyRequestsException extends HttpException {
  constructor(message?: string) {
    super(message || 'Too Many Requests', 429);
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Method Not Allowed', 405);
  }
}

export class NotAcceptableException extends HttpException {
  constructor(message?: string) {
    super(message || 'Not Acceptable', 406);
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(message?: string) {
    super(message || 'Request Timeout', 408);
  }
}

export class PreconditionFailedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Precondition Failed', 412);
  }
}

export class LockedException extends HttpException {
  constructor(message?: string) {
    super(message || 'Locked', 423);
  }
}

export class FailedDependencyException extends HttpException {
  constructor(message?: string) {
    super(message || 'Failed Dependency', 424);
  }
}

export class PreconditionRequiredException extends HttpException {
  constructor(message?: string) {
    super(message || 'Precondition Required', 428);
  }
}
