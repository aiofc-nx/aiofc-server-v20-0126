[@aiofc/server-v20-0126](../../../../../../../index.md) / [packages/pino-logger/src/lib/interface/params](../index.md) / Params

# Interface: Params

参数接口

## Remarks

该接口定义了PinoLogger的配置参数

## Properties

### assignResponse?

```ts
optional assignResponse: boolean;
```

可选参数，用于在调用期间分配响应记录器
`PinoLogger.分配`。默认情况下，"分配"不会影响响应日志
（例如"请求已完成"）。

***

### exclude?

```ts
optional exclude: (string | RouteInfo)[];
```

路由的可选参数。它应该实现接口
NestJS 内置 `MiddlewareConfigProxy['exclude']` 的参数。

#### See

https://docs.nestjs.com/middleware#applying-middleware
它可用于禁用自动 req/res 日志和从以下日志中删除请求上下文。它适用于所有请求
默认。如果您只需要关闭自动请求/响应
记录某些特定（或所有）路由，但保留应用程序的请求上下文
日志使用 `pinoHttp.autoLogging` 字段。

***

### forRoutes?

```ts
optional forRoutes: (string | Type | RouteInfo)[];
```

路由的可选参数。它应该实现接口
NestJS 内置 `MiddlewareConfigProxy['forRoutes']` 的参数。

#### See

https://docs.nestjs.com/middleware#applying-middleware
它可用于禁用自动 req/res 日志和
从以下日志中删除请求上下文。它适用于所有请求
默认。如果您只需要关闭自动请求/响应
记录某些特定（或所有）路由，但保留应用程序的请求上下文
日志使用 `pinoHttp.autoLogging` 字段。

***

### ignorePaths?

```ts
optional ignorePaths: (string | RegExp)[];
```

不需要记录日志的路径

***

### logRequestBody?

```ts
optional logRequestBody: boolean;
```

是否记录请求体

***

### logResponseBody?

```ts
optional logResponseBody: boolean;
```

是否记录响应体

***

### pinoHttp?

```ts
optional pinoHttp: Options | DestinationStream | [Options, DestinationStream];
```

`pino-http` 模块的可选参数

#### See

https://github.com/pinojs/pino-http#pinohttpopts-stream

***

### renameContext?

```ts
optional renameContext: string;
```

用于更改结果日志中的属性名称"context"的可选参数，
所以日志会是这样的：
{"level":30,..."RENAME_CONTEXT_VALUE_HERE":"AppController"}

***

### sensitiveFields?

```ts
optional sensitiveFields: string[];
```

需要脱敏的字段

***

### sensitiveHeaders?

```ts
optional sensitiveHeaders: string[];
```

需要脱敏的请求头

***

### trace?

```ts
optional trace: object;
```

追踪配置

#### cache?

```ts
optional cache: object;
```

缓存追踪配置

##### cache.enabled

```ts
enabled: boolean;
```

是否启用缓存追踪

##### cache.logKeys

```ts
logKeys: boolean;
```

是否记录缓存键

##### cache.logValues

```ts
logValues: boolean;
```

是否记录缓存值

#### callStack?

```ts
optional callStack: boolean;
```

是否记录调用链路

#### enabled

```ts
enabled: boolean;
```

是否启用追踪

#### parentIdHeader?

```ts
optional parentIdHeader: string;
```

父追踪ID头

#### resources?

```ts
optional resources: boolean;
```

是否记录系统资源使用

#### sampleRate?

```ts
optional sampleRate: number;
```

采样率 (0-1)

#### timing?

```ts
optional timing: boolean;
```

是否记录请求耗时分布

#### traceIdHeader?

```ts
optional traceIdHeader: string;
```

追踪ID头

***

### transport?

```ts
optional transport: object;
```

日志传输配置

#### options

```ts
options: object;
```

传输选项

##### options.colorize

```ts
colorize: boolean;
```

是否启用彩色输出

##### options.ignore

```ts
ignore: string;
```

忽略的字段

##### options.levelFirst

```ts
levelFirst: boolean;
```

级别信息是否在前

##### options.messageFormat

```ts
messageFormat: string;
```

消息格式模板

##### options.messageKey

```ts
messageKey: string;
```

消息字段名

##### options.minimumLevel

```ts
minimumLevel: string;
```

最小日志级别

##### options.singleLine

```ts
singleLine: boolean;
```

是否单行输出

##### options.sync

```ts
sync: boolean;
```

是否同步写入

##### options.translateTime

```ts
translateTime: string;
```

时间戳格式

#### target

```ts
target: string;
```

传输目标

***

### useExisting?

```ts
optional useExisting: true;
```

如果您使用的是可选参数，可跳过 pino 配置
FastifyAdapter，并且已经在适配器的配置中配置了记录器。优点
这种方法的缺点在常见问题解答部分中有描述
文档：

#### See

https://github.com/iamolegga/nestjs-pino#faq.
