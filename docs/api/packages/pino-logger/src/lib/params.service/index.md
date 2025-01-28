[@aiofc/server-v20-0126](../../../../../index.md) / packages/pino-logger/src/lib/params.service

# packages/pino-logger/src/lib/params.service

## Variables

### loggerRecordingFilterConfig

```ts
const loggerRecordingFilterConfig: LoggerRecordingFilterConfig;
```

***

### loggerTransportConfig

```ts
const loggerTransportConfig: LoggerTransport;
```

***

### loggingInitConfig

```ts
const loggingInitConfig: object;
```

#### Type declaration

##### cache

```ts
cache: object;
```

###### cache.enabled

```ts
enabled: boolean;
```

###### cache.logKeys

```ts
logKeys: boolean;
```

###### cache.logValues

```ts
logValues: boolean;
```

##### enabled

```ts
enabled: boolean;
```

##### ignorePaths

```ts
ignorePaths: string[];
```

##### logRequestBody

```ts
logRequestBody: boolean;
```

##### logResponseBody

```ts
logResponseBody: boolean;
```

##### parentIdHeader

```ts
parentIdHeader: string;
```

##### pinoHttp

```ts
pinoHttp: object;
```

###### pinoHttp.level

```ts
level: string;
```

###### pinoHttp.transport

```ts
transport: LoggerTransport;
```

##### sensitiveFields

```ts
sensitiveFields: string[];
```

##### sensitiveHeaders

```ts
sensitiveHeaders: string[];
```

##### traceIdHeader

```ts
traceIdHeader: string;
```

***

### loggingInterceptorConfig

```ts
const loggingInterceptorConfig: object;
```

#### Type declaration

##### cache

```ts
cache: object;
```

###### cache.enabled

```ts
enabled: boolean;
```

###### cache.logKeys

```ts
logKeys: boolean;
```

###### cache.logValues

```ts
logValues: boolean;
```

##### enabled

```ts
enabled: boolean;
```

##### ignorePaths

```ts
ignorePaths: string[];
```

##### logRequestBody

```ts
logRequestBody: boolean;
```

##### logResponseBody

```ts
logResponseBody: boolean;
```

##### options

```ts
options: LoggerTransportOptions;
```

##### parentIdHeader

```ts
parentIdHeader: string;
```

##### sensitiveFields

```ts
sensitiveFields: string[];
```

##### sensitiveHeaders

```ts
sensitiveHeaders: string[];
```

##### target

```ts
target: string;
```

##### traceIdHeader

```ts
traceIdHeader: string;
```

***

### traceConfig

```ts
const traceConfig: TraceConfig;
```

链路追踪配置对象

#### Description

用于配置分布式链路追踪的相关参数,实现请求链路的全链路追踪功能
