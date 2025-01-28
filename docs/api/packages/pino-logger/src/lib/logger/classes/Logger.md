[@aiofc/server-v20-0126](../../../../../../index.md) / [packages/pino-logger/src/lib/logger](../index.md) / Logger

# Class: Logger

## Implements

- `LoggerService`

## Constructors

### new Logger()

```ts
new Logger(logger, __namedParameters): Logger
```

#### Parameters

##### logger

[`PinoLogger`](../../pino-logger/classes/PinoLogger.md)

##### \_\_namedParameters

[`Params`](../../interface/params/interfaces/Params.md)

#### Returns

[`Logger`](Logger.md)

## Properties

### contextName

```ts
private readonly contextName: string;
```

***

### logger

```ts
protected readonly logger: PinoLogger;
```

## Methods

### call()

```ts
private call(
   level, 
   message, ...
   optionalParams): void
```

#### Parameters

##### level

`Level`

##### message

`any`

##### optionalParams

...`any`[]

#### Returns

`void`

***

### debug()

```ts
debug(message, ...optionalParams): void
```

Write a 'debug' level log.

#### Parameters

##### message

`any`

##### optionalParams

...`any`[]

#### Returns

`void`

#### Implementation of

```ts
LoggerService.debug
```

***

### error()

```ts
error(message, ...optionalParams): void
```

Write an 'error' level log.

#### Parameters

##### message

`any`

##### optionalParams

...`any`[]

#### Returns

`void`

#### Implementation of

```ts
LoggerService.error
```

***

### fatal()

```ts
fatal(message, ...optionalParams): void
```

Write a 'fatal' level log.

#### Parameters

##### message

`any`

##### optionalParams

...`any`[]

#### Returns

`void`

#### Implementation of

```ts
LoggerService.fatal
```

***

### isWrongExceptionsHandlerContract()

```ts
private isWrongExceptionsHandlerContract(
   level, 
   message, 
   params): params is [string]
```

Unfortunately built-in (not only) `^.*Exception(s?)Handler$` classes call `.error`
method with not supported contract:

- ExceptionsHandler

#### Parameters

##### level

`Level`

##### message

`any`

##### params

`any`[]

#### Returns

`params is [string]`

#### See

 - https://github.com/nestjs/nest/blob/35baf7a077bb972469097c5fea2f184b7babadfc/packages/core/exceptions/base-exception-filter.ts#L60-L63

- ExceptionHandler
 - https://github.com/nestjs/nest/blob/99ee3fd99341bcddfa408d1604050a9571b19bc9/packages/core/errors/exception-handler.ts#L9

- WsExceptionsHandler
 - https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/websockets/exceptions/base-ws-exception-filter.ts#L47-L50

- RpcExceptionsHandler
 - https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/microservices/exceptions/base-rpc-exception-filter.ts#L26-L30

- all of them
 - https://github.com/search?l=TypeScript&q=org%3Anestjs+logger+error+stack&type=Code

***

### log()

```ts
log(message, ...optionalParams): void
```

Write a 'log' level log.

#### Parameters

##### message

`any`

##### optionalParams

...`any`[]

#### Returns

`void`

#### Implementation of

```ts
LoggerService.log
```

***

### verbose()

```ts
verbose(message, ...optionalParams): void
```

Write a 'verbose' level log.

#### Parameters

##### message

`any`

##### optionalParams

...`any`[]

#### Returns

`void`

#### Implementation of

```ts
LoggerService.verbose
```

***

### warn()

```ts
warn(message, ...optionalParams): void
```

Write a 'warn' level log.

#### Parameters

##### message

`any`

##### optionalParams

...`any`[]

#### Returns

`void`

#### Implementation of

```ts
LoggerService.warn
```
