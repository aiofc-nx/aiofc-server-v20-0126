[@aiofc/server-v20-0126](../../../../../../index.md) / [packages/pino-logger/src/lib/logger.module](../index.md) / LoggerModule

# Class: LoggerModule

As NestJS@11 still supports express@4 `*`-style routing by itself let's keep
it for the backward compatibility. On the next major NestJS release `*` we
can replace it with `/{*splat}`, and drop the support for NestJS@9 and below.

## Constructors

### new LoggerModule()

```ts
new LoggerModule(params): LoggerModule
```

#### Parameters

##### params

[`Params`](../../interface/params/interfaces/Params.md)

#### Returns

[`LoggerModule`](LoggerModule.md)

## Properties

### params

```ts
private readonly params: Params;
```

## Methods

### forRootAsync()

```ts
static forRootAsync(params?): Promise<DynamicModule>
```

#### Parameters

##### params?

[`Params`](../../interface/params/interfaces/Params.md)

#### Returns

`Promise`\<`DynamicModule`\>
