[@aiofc/server-v20-0126](../../../../../index.md) / packages/zod-env/src/lib/z-yaml-loader

# packages/zod-env/src/lib/z-yaml-loader

## Interfaces

| Interface | Description |
| ------ | ------ |
| [YamlFileOptions](interfaces/YamlFileOptions.md) | 接口用于描述配置文件（yaml）的设置选项 |

## Functions

### loadYamlEnvOptions()

```ts
function loadYamlEnvOptions<T>(options, schema): T
```

用于加载配置文件（yaml）并验证设定环境变量的函数。

#### Type Parameters

• **T**

#### Parameters

##### options

[`YamlFileOptions`](interfaces/YamlFileOptions.md)

配置文件选项,用于指定配置文件的位置和前缀

##### schema

`ZodType`\<`T`, `T`\>

Zod schema对象,用于验证配置文件内容

#### Returns

`T`

经过验证的配置对象

#### Remarks

该函数会根据NODE_ENV环境变量加载对应的配置文件，并使用Zod schema进行验证。
如果配置文件不存在或验证失败，则抛出错误并退出进程。

#### Throws

当配置文件不存在或验证失败时退出进程

#### Example

```typescript
// 定义配置schema
const configSchema = z.object({
  port: z.number(),
  host: z.string(),
  database: z.object({
    url: z.string(),
  })
});

// 加载并验证配置
const config = loadYamlEnvOptions({
  configDir: './config',
  configFilePrefix: 'app'
}, configSchema);

// 使用配置
console.log(config.port); // 类型安全的访问
```
