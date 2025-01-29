[@aiofc/server-v20-0126](../../../../../../index.md) / packages/pino-logger/src/lib/interface/params

# packages/pino-logger/src/lib/interface/params

## Interfaces

| Interface | Description |
| ------ | ------ |
| [Params](interfaces/Params.md) | 参数接口 |

## Type Aliases

### PassedLogger

```ts
type PassedLogger = object;
```

已传递的logger类型

#### Type declaration

##### logger

```ts
logger: Logger;
```

## Variables

### PARAMS\_PROVIDER\_TOKEN

```ts
const PARAMS_PROVIDER_TOKEN: "pino-params" = 'pino-params';
```

参数提供者令牌

## Functions

### isPassedLogger()

```ts
function isPassedLogger(pinoHttpProp): pinoHttpProp is PassedLogger
```

检查是否传递了logger

#### Parameters

##### pinoHttpProp

`any`

传递的logger

#### Returns

`pinoHttpProp is PassedLogger`

如果传递了logger则返回true
