[@aiofc/server-v20-0126](../../../../../../../index.md) / [apps/platform/src/common/filters/global-exception.filter](../index.md) / GlobalExceptionFilter

# Class: GlobalExceptionFilter

全局异常过滤器

负责处理应用程序中所有未捕获的异常,将其转换为标准的错误响应格式

主要功能:
- 处理各种类型的异常并转换为统一的错误响应格式
- 支持国际化错误消息
- 在开发环境下提供详细的错误信息
- 记录错误日志

支持的异常类型:
- UnprocessableEntityException: 处理请求实体验证错误
- ValidationException: 处理自定义验证异常
- HttpException: 处理标准的HTTP异常
- PostgresError: 处理Postgres数据库错误
- Error: 处理其他通用错误

## Extends

- `BaseExceptionFilter`

## Constructors

### new GlobalExceptionFilter()

```ts
new GlobalExceptionFilter(
   httpAdapterHost, 
   i18n, 
   cls): GlobalExceptionFilter
```

#### Parameters

##### httpAdapterHost

`HttpAdapterHost`

##### i18n

`I18nService`\<[`I18nTranslations`](../../../../generated/i18n.generated/index.md#i18ntranslations)\>

##### cls

`ClsService`

#### Returns

[`GlobalExceptionFilter`](GlobalExceptionFilter.md)

#### Overrides

```ts
BaseExceptionFilter.constructor
```

## Properties

### cls

```ts
private readonly cls: ClsService;
```

***

### debug

```ts
private debug: boolean = false;
```

***

### httpAdapterHost

```ts
protected readonly httpAdapterHost: HttpAdapterHost;
```

#### Inherited from

```ts
BaseExceptionFilter.httpAdapterHost
```

***

### i18n

```ts
private readonly i18n: I18nService<I18nTranslations>;
```

***

### logger

```ts
private readonly logger: Logger;
```

## Methods

### catch()

```ts
catch(exception, host): void
```

捕获并处理异常的主要方法

#### Parameters

##### exception

`any`

捕获到的异常对象

##### host

`ArgumentsHost`

提供请求/响应上下文的参数主机

#### Returns

`void`

#### Overrides

```ts
BaseExceptionFilter.catch
```

***

### extractValidationErrorDetails()

```ts
private extractValidationErrorDetails(errors): ErrorDetailDto[]
```

从验证错误数组中提取错误详情

递归处理嵌套的验证错误,生成扁平化的错误详情数组

#### Parameters

##### errors

`ValidationError`[]

验证错误数组

#### Returns

[`ErrorDetailDto`](../../../dto/error-detail.dto/classes/ErrorDetailDto.md)[]

错误详情数组

***

### getPostgresErrorMessage()

```ts
private getPostgresErrorMessage(error): string
```

#### Parameters

##### error

`PostgresError`

#### Returns

`string`

***

### handleError()

```ts
private handleError(error): ErrorDto
```

处理通用错误

处理所有其他未明确分类的错误

#### Parameters

##### error

`Error`

Error异常对象

#### Returns

[`ErrorDto`](../../../dto/error.dto/classes/ErrorDto.md)

标准化的错误响应对象

***

### handleHttpException()

```ts
private handleHttpException(exception): ErrorDto
```

处理HTTP异常

#### Parameters

##### exception

`HttpException`

HttpException异常对象

#### Returns

[`ErrorDto`](../../../dto/error.dto/classes/ErrorDto.md)

标准化的错误响应对象

***

### handlePostgresError()

```ts
private handlePostgresError(error): ErrorDto
```

处理 Postgres 数据库错误

#### Parameters

##### error

`PostgresError`

#### Returns

[`ErrorDto`](../../../dto/error.dto/classes/ErrorDto.md)

***

### handleUnprocessableEntityException()

```ts
private handleUnprocessableEntityException(exception): ErrorDto
```

处理实体验证异常

当请求负载验证失败时触发,例如:
- 必填字段缺失
- 字段格式不正确
- 字段值不符合约束条件

#### Parameters

##### exception

`UnprocessableEntityException`

UnprocessableEntityException异常对象

#### Returns

[`ErrorDto`](../../../dto/error.dto/classes/ErrorDto.md)

标准化的错误响应对象

***

### handleValidationException()

```ts
private handleValidationException(exception): ErrorDto
```

处理自定义验证异常

#### Parameters

##### exception

[`ValidationException`](../../../../exceptions/validation.exception/classes/ValidationException.md)

ValidationException异常对象

#### Returns

[`ErrorDto`](../../../dto/error.dto/classes/ErrorDto.md)

标准化的错误响应对象
