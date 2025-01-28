[@aiofc/server-v20-0126](../../../../../../index.md) / [apps/platform/src/exceptions/validation.exception](../index.md) / ValidationException

# Class: ValidationException

验证异常类

用于抛出带有自定义错误代码和消息的验证错误

 ValidationException

## Example

```ts
throw new ValidationException(ErrorCode.V001, '用户名不能为空');
```

## Param

错误代码,默认为 V000 (通用验证错误)

## Param

可选的错误消息。如果未提供,将使用错误代码对应的默认消息

## Extends

- `BadRequestException`

## Constructors

### new ValidationException()

```ts
new ValidationException(error, message?): ValidationException
```

#### Parameters

##### error

[`ErrorCode`](../../../common/constants/error-code.constant/enumerations/ErrorCode.md) = `ErrorCode.V000`

##### message?

`string`

#### Returns

[`ValidationException`](ValidationException.md)

#### Overrides

```ts
BadRequestException.constructor
```
