[@aiofc/server-v20-0126](../../../../../../../index.md) / [packages/pino-logger/src/lib/interceptor/detailed-logging.interceptor](../index.md) / DetailedLoggingInterceptor

# Class: DetailedLoggingInterceptor

## Implements

- `NestInterceptor`

## Constructors

### new DetailedLoggingInterceptor()

```ts
new DetailedLoggingInterceptor(cls, logger): DetailedLoggingInterceptor
```

#### Parameters

##### cls

`ClsService`

##### logger

[`PinoLogger`](../../../pino-logger/classes/PinoLogger.md)

#### Returns

[`DetailedLoggingInterceptor`](DetailedLoggingInterceptor.md)

## Properties

### cls

```ts
private readonly cls: ClsService;
```

***

### logger

```ts
private readonly logger: PinoLogger;
```

***

### params

```ts
private readonly params: Params;
```

## Methods

### formatLog()

```ts
private formatLog(
   level, 
   message, 
   details): string
```

#### Parameters

##### level

`string`

##### message

`string`

##### details

`any`

#### Returns

`string`

***

### getErrorCode()

```ts
private getErrorCode(error): number
```

获取错误状态码

#### Parameters

##### error

`Error`

#### Returns

`number`

***

### getErrorDetails()

```ts
private getErrorDetails(error): Record<string, any>
```

获取错误详情

#### Parameters

##### error

`Error`

#### Returns

`Record`\<`string`, `any`\>

***

### getErrorType()

```ts
private getErrorType(error): string
```

获取错误类型

#### Parameters

##### error

`Error`

#### Returns

`string`

***

### getPerformanceMetrics()

```ts
private getPerformanceMetrics(startTime): Record<string, any>
```

获取性能指标

#### Parameters

##### startTime

`number`

#### Returns

`Record`\<`string`, `any`\>

***

### getRouteInfo()

```ts
private getRouteInfo(request): object
```

获取路由信息

#### Parameters

##### request

`FastifyRequest`\<`IncomingMessage`, `ResolveFastifyRequestType`\<`FastifyTypeProviderDefault`, `FastifySchema`, `RouteGenericInterface`\>\>

#### Returns

`object`

##### params

```ts
params: unknown = request.params;
```

##### query

```ts
query: unknown = request.query;
```

##### routeId

```ts
routeId: string;
```

***

### getTraceInfo()

```ts
private getTraceInfo(request): Record<string, any>
```

获取追踪信息

#### Parameters

##### request

`FastifyRequest`\<`IncomingMessage`, `ResolveFastifyRequestType`\<`FastifyTypeProviderDefault`, `FastifySchema`, `RouteGenericInterface`\>\>

#### Returns

`Record`\<`string`, `any`\>

***

### getUserInfo()

```ts
private getUserInfo(request): Record<string, any>
```

获取用户信息

#### Parameters

##### request

`FastifyRequest`\<`IncomingMessage`, `ResolveFastifyRequestType`\<`FastifyTypeProviderDefault`, `FastifySchema`, `RouteGenericInterface`\>\>

#### Returns

`Record`\<`string`, `any`\>

***

### intercept()

```ts
intercept(context, next): Observable<any>
```

Method to implement a custom interceptor.

#### Parameters

##### context

`ExecutionContext`

an `ExecutionContext` object providing methods to access the
route handler and class about to be invoked.

##### next

`CallHandler`

a reference to the `CallHandler`, which provides access to an
`Observable` representing the response stream from the route handler.

#### Returns

`Observable`\<`any`\>

#### Implementation of

```ts
NestInterceptor.intercept
```

***

### logCacheOperation()

```ts
private logCacheOperation(
   type, 
   key, 
   value?, 
   duration?, 
   success?): void
```

记录缓存操作

#### Parameters

##### type

`"set"` | `"get"` | `"del"`

##### key

`string`

##### value?

`any`

##### duration?

`number`

##### success?

`boolean` = `true`

#### Returns

`void`

***

### logError()

```ts
private logError(
   error, 
   request, 
   response, 
   startTime, 
   metrics?): void
```

记录错误信息

#### Parameters

##### error

`Error`

##### request

`FastifyRequest`\<`IncomingMessage`, `ResolveFastifyRequestType`\<`FastifyTypeProviderDefault`, `FastifySchema`, `RouteGenericInterface`\>\>

##### response

`FastifyReply`\<`IncomingMessage`, `ServerResponse`\>

##### startTime

`number`

##### metrics?

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### logRequest()

```ts
private logRequest(request): void
```

记录请求信息

#### Parameters

##### request

`FastifyRequest`\<`IncomingMessage`, `ResolveFastifyRequestType`\<`FastifyTypeProviderDefault`, `FastifySchema`, `RouteGenericInterface`\>\>

#### Returns

`void`

***

### logResponse()

```ts
private logResponse(
   request, 
   response, 
   startTime, 
   metrics?): void
```

记录响应信息

#### Parameters

##### request

`FastifyRequest`\<`IncomingMessage`, `ResolveFastifyRequestType`\<`FastifyTypeProviderDefault`, `FastifySchema`, `RouteGenericInterface`\>\>

##### response

`FastifyReply`\<`IncomingMessage`, `ServerResponse`\>

##### startTime

`number`

##### metrics?

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### sanitizeBody()

```ts
private sanitizeBody(body): any
```

脱敏请求体

#### Parameters

##### body

`any`

#### Returns

`any`

***

### sanitizeHeaders()

```ts
private sanitizeHeaders(headers): Record<string, any>
```

脱敏请求头

#### Parameters

##### headers

`Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

***

### shouldSample()

```ts
private shouldSample(): boolean
```

是否需要采样

#### Returns

`boolean`

***

### shouldSkipLogging()

```ts
private shouldSkipLogging(request): boolean
```

判断是否需要跳过日志记录

#### Parameters

##### request

`FastifyRequest`\<`IncomingMessage`, `ResolveFastifyRequestType`\<`FastifyTypeProviderDefault`, `FastifySchema`, `RouteGenericInterface`\>\>

#### Returns

`boolean`
