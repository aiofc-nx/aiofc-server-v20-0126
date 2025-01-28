[@aiofc/server-v20-0126](../../../../../../../index.md) / [packages/pino-logger/src/lib/interceptor/simple-logging.interceptor](../index.md) / SimpleLoggingInterceptor

# Class: SimpleLoggingInterceptor

## Implements

- `NestInterceptor`

## Constructors

### new SimpleLoggingInterceptor()

```ts
new SimpleLoggingInterceptor(): SimpleLoggingInterceptor
```

#### Returns

[`SimpleLoggingInterceptor`](SimpleLoggingInterceptor.md)

## Methods

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
