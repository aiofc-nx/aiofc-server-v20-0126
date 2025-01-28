[@aiofc/server-v20-0126](../../../../../../index.md) / [packages/pino-logger/src/lib/pino-logger](../index.md) / PinoLogger

# Class: PinoLogger

Pino日志记录器的NestJS封装类

## Remarks

提供了以下功能:
- 支持请求作用域的日志上下文
- 自动注入上下文信息
- 错误对象的特殊处理
- 支持动态绑定额外字段

## Example

```typescript
// 基础用法
@Injectable()
class UserService {
  constructor(private logger: PinoLogger) {
    this.logger.setContext('UserService');
  }

  async createUser() {
    this.logger.info('创建新用户');
    // 输出: {"context": "UserService", "msg": "创建新用户"}
  }
}
```

## Implements

- `PinoMethods`

## Constructors

### new PinoLogger()

```ts
new PinoLogger(__namedParameters, cls): PinoLogger
```

创建一个新的PinoLogger实例

#### Parameters

##### \_\_namedParameters

[`Params`](../../interface/params/interfaces/Params.md)

##### cls

`ClsService`

请求作用域服务实例

#### Returns

[`PinoLogger`](PinoLogger.md)

#### Remarks

构造函数会根据传入的pinoHttp参数初始化logger实例:
- 如果是数组,则作为pino构造函数的参数传入
- 如果是已存在的logger实例,则直接使用
- 如果包含stream属性,则使用pino(options, stream)方式构造
- 其他情况下直接传入pino构造函数

## Properties

### cls

```ts
private readonly cls: ClsService;
```

请求作用域服务实例

***

### context

```ts
protected context: string = '';
```

当前logger的上下文名称

***

### contextName

```ts
protected readonly contextName: string;
```

上下文字段的键名

***

### errorKey

```ts
protected readonly errorKey: string = 'err';
```

错误对象的键名

***

### root

```ts
readonly static root: Logger<never, boolean>;
```

根logger实例,可用于运行时更改参数

#### Remarks

仅当LoggerParams中useExisting为false时可用

## Accessors

### logger

#### Get Signature

```ts
get logger(): Logger<never, boolean>
```

获取当前请求作用域的logger实例

##### Returns

`Logger`\<`never`, `boolean`\>

## Methods

### assign()

```ts
assign(fields): void
```

为当前请求作用域的logger绑定额外字段

#### Parameters

##### fields

`Bindings`

要绑定的字段对象

#### Returns

`void`

#### Throws

如果在请求作用域外调用则抛出错误

***

### call()

```ts
protected call(method, ...args): void
```

处理日志记录的核心方法

#### Parameters

##### method

`Level`

日志级别

##### args

日志参数

\[`string`, `...args: any[]`\] | \[`object`, `string`, `...args: any[]`\]

#### Returns

`void`

#### Remarks

该方法会:
1. 注入上下文信息
2. 特殊处理Error对象
3. 合并对象参数

***

### debug()

#### Call Signature

```ts
debug(msg, ...args): void
```

记录调试级别的日志

##### Parameters

###### msg

`string`

###### args

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.debug
```

#### Call Signature

```ts
debug(
   obj, 
   msg?, ...
   args?): void
```

记录调试级别的日志

##### Parameters

###### obj

`unknown`

###### msg?

`string`

###### args?

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.debug
```

***

### error()

#### Call Signature

```ts
error(msg, ...args): void
```

记录错误级别的日志

##### Parameters

###### msg

`string`

###### args

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.error
```

#### Call Signature

```ts
error(
   obj, 
   msg?, ...
   args?): void
```

记录错误级别的日志

##### Parameters

###### obj

`unknown`

###### msg?

`string`

###### args?

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.error
```

***

### fatal()

#### Call Signature

```ts
fatal(msg, ...args): void
```

记录致命错误级别的日志

##### Parameters

###### msg

`string`

###### args

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.fatal
```

#### Call Signature

```ts
fatal(
   obj, 
   msg?, ...
   args?): void
```

记录致命错误级别的日志

##### Parameters

###### obj

`unknown`

###### msg?

`string`

###### args?

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.fatal
```

***

### info()

#### Call Signature

```ts
info(msg, ...args): void
```

记录信息级别的日志

##### Parameters

###### msg

`string`

###### args

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.info
```

#### Call Signature

```ts
info(
   obj, 
   msg?, ...
   args?): void
```

记录信息级别的日志

##### Parameters

###### obj

`unknown`

###### msg?

`string`

###### args?

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.info
```

***

### setContext()

```ts
setContext(value): void
```

设置logger的上下文名称

#### Parameters

##### value

`string`

上下文名称

#### Returns

`void`

***

### trace()

#### Call Signature

```ts
trace(msg, ...args): void
```

记录追踪级别的日志

##### Parameters

###### msg

`string`

###### args

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.trace
```

#### Call Signature

```ts
trace(
   obj, 
   msg?, ...
   args?): void
```

记录追踪级别的日志

##### Parameters

###### obj

`unknown`

###### msg?

`string`

###### args?

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.trace
```

***

### warn()

#### Call Signature

```ts
warn(msg, ...args): void
```

记录警告级别的日志

##### Parameters

###### msg

`string`

###### args

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.warn
```

#### Call Signature

```ts
warn(
   obj, 
   msg?, ...
   args?): void
```

记录警告级别的日志

##### Parameters

###### obj

`unknown`

###### msg?

`string`

###### args?

...`any`[]

##### Returns

`void`

##### Implementation of

```ts
PinoMethods.warn
```
