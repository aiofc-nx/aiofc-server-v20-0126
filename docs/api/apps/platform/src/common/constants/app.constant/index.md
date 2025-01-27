[@aiofc/server-v20-0126](../../../../../../index.md) / apps/platform/src/common/constants/app.constant

# apps/platform/src/common/constants/app.constant

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [Environment](enumerations/Environment.md) | 环境枚举 |
| [LogService](enumerations/LogService.md) | 日志服务枚举 |
| [Order](enumerations/Order.md) | 排序方向枚举 |

## Variables

### DEFAULT\_CURRENT\_PAGE

```ts
const DEFAULT_CURRENT_PAGE: 1 = 1;
```

默认当前页码

***

### DEFAULT\_PAGE\_LIMIT

```ts
const DEFAULT_PAGE_LIMIT: 10 = 10;
```

默认分页大小

***

### IS\_AUTH\_OPTIONAL

```ts
const IS_AUTH_OPTIONAL: "isAuthOptional" = 'isAuthOptional';
```

标记路由为可选认证

***

### IS\_PUBLIC

```ts
const IS_PUBLIC: "isPublic" = 'isPublic';
```

标记路由为公开访问(无需认证)

***

### loggingRedactPaths

```ts
const loggingRedactPaths: string[];
```

需要在日志中隐藏的敏感信息路径

***

### SYSTEM\_USER\_ID

```ts
const SYSTEM_USER_ID: "system" = 'system';
```

系统用户ID
