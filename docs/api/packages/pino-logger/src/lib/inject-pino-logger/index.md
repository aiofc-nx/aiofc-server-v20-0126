[@aiofc/server-v20-0126](../../../../../index.md) / packages/pino-logger/src/lib/inject-pino-logger

# packages/pino-logger/src/lib/inject-pino-logger

## Functions

### createProvidersForDecorated()

```ts
function createProvidersForDecorated(): Provider<PinoLogger>[]
```

为所有被装饰的上下文创建提供者数组

#### Returns

`Provider`\<[`PinoLogger`](../pino-logger/classes/PinoLogger.md)\>[]

PinoLogger 提供者数组

#### Example

```typescript
\@Module({
  providers: [
    ...createProvidersForDecorated(),
    // 其他提供者
  ],
})
export class AppModule {}
```

***

### getLoggerToken()

```ts
function getLoggerToken(context): string
```

**`Internal`**

生成日志器的唯一标识符

#### Parameters

##### context

`string`

日志上下文名称

#### Returns

`string`

完整的日志器标识符

***

### InjectPinoLogger()

```ts
function InjectPinoLogger(context): PropertyDecorator & ParameterDecorator
```

注入 PinoLogger 的装饰器工厂函数

#### Parameters

##### context

`string` = `''`

日志上下文名称，默认为空字符串

#### Returns

`PropertyDecorator` & `ParameterDecorator`

Inject 装饰器实例

#### Example

```typescript
class UserService {
  constructor(
    @InjectPinoLogger('UserService')
    private readonly logger: PinoLogger
  ) {}
}
```
