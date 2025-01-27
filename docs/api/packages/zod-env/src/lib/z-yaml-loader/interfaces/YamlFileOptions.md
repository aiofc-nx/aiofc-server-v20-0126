[@aiofc/server-v20-0126](../../../../../../index.md) / [packages/zod-env/src/lib/z-yaml-loader](../index.md) / YamlFileOptions

# Interface: YamlFileOptions

接口用于描述配置文件（yaml）的设置选项

## Remarks

包括:
- 配置文件的存放目录
- 配置文件的文件名前缀
通过这些选项，可以灵活地指定配置文件的存放位置和文件命名方式。

命名规则:
- 配置文件的文件名格式为: `{prefix}.{NODE_ENV}.yaml`

## Example

```typescript
const options: YamlFileOptions = {
  configDir: '/path/to/config',    // 配置文件存放目录
  configFilePrefix: 'app'          // 生成的配置文件名将为: app.development.yaml
};
```

## Properties

### configDir?

```ts
optional configDir: string;
```

配置文件目录路径

#### Default

```ts
process.cwd()/assets
```

***

### configFilePrefix

```ts
configFilePrefix: string;
```

配置文件名称前缀

#### Default

```ts
'config'
```

#### Remarks

最终的配置文件名格式为: `{prefix}.{NODE_ENV}.yaml`
