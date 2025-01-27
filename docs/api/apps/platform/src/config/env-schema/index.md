[@aiofc/server-v20-0126](../../../../../index.md) / apps/platform/src/config/env-schema

# apps/platform/src/config/env-schema

## Type Aliases

### EnvValidatedConfig

```ts
type EnvValidatedConfig = z.infer<typeof EnvSchema>;
```

## Variables

### EnvSchema

```ts
const EnvSchema: ZodObject<{
  app: ZodObject<{
     globalPrefix: ZodDefault<ZodString>;
     NODE_ENV: ZodDefault<ZodEnum<[DEVELOPMENT, PRODUCTION, TEST]>>;
     port: ZodDefault<ZodNumber>;
    }, "strip", {
     globalPrefix: string;
     NODE_ENV:   | DEVELOPMENT
        | PRODUCTION
        | TEST;
     port: number;
    }, {
     globalPrefix: string;
     NODE_ENV:   | DEVELOPMENT
        | PRODUCTION
        | TEST;
     port: number;
    }>;
  database: ZodObject<{
     host: ZodString;
     isolationStrategy: ZodDefault<ZodEnum<["schema", "row"]>>;
     name: ZodString;
     password: ZodString;
     pool: ZodOptional<ZodObject<{
        connect_timeout: ZodOptional<ZodNumber>;
        idle_timeout: ZodOptional<ZodNumber>;
        max: ZodOptional<ZodNumber>;
        max_lifetime: ZodOptional<ZodNumber>;
        min: ZodOptional<ZodNumber>;
       }, "strip", {
        connect_timeout: number;
        idle_timeout: number;
        max: number;
        max_lifetime: number;
        min: number;
       }, {
        connect_timeout: number;
        idle_timeout: number;
        max: number;
        max_lifetime: number;
        min: number;
       }>>;
     port: ZodDefault<ZodNumber>;
     systemSchema: ZodString;
     user: ZodString;
    }, "strip", {
     host: string;
     isolationStrategy: "schema" | "row";
     name: string;
     password: string;
     pool: {
        connect_timeout: number;
        idle_timeout: number;
        max: number;
        max_lifetime: number;
        min: number;
       };
     port: number;
     systemSchema: string;
     user: string;
    }, {
     host: string;
     isolationStrategy: "schema" | "row";
     name: string;
     password: string;
     pool: {
        connect_timeout: number;
        idle_timeout: number;
        max: number;
        max_lifetime: number;
        min: number;
       };
     port: number;
     systemSchema: string;
     user: string;
    }>;
  logger: ZodObject<{
     trackingIdHeader: ZodOptional<ZodString>;
    }, "strip", {
     trackingIdHeader: string;
    }, {
     trackingIdHeader: string;
    }>;
 }, "strip", {
  app: {
     globalPrefix: string;
     NODE_ENV:   | DEVELOPMENT
        | PRODUCTION
        | TEST;
     port: number;
    };
  database: {
     host: string;
     isolationStrategy: "schema" | "row";
     name: string;
     password: string;
     pool: {
        connect_timeout: number;
        idle_timeout: number;
        max: number;
        max_lifetime: number;
        min: number;
       };
     port: number;
     systemSchema: string;
     user: string;
    };
  logger: {
     trackingIdHeader: string;
    };
 }, {
  app: {
     globalPrefix: string;
     NODE_ENV:   | DEVELOPMENT
        | PRODUCTION
        | TEST;
     port: number;
    };
  database: {
     host: string;
     isolationStrategy: "schema" | "row";
     name: string;
     password: string;
     pool: {
        connect_timeout: number;
        idle_timeout: number;
        max: number;
        max_lifetime: number;
        min: number;
       };
     port: number;
     systemSchema: string;
     user: string;
    };
  logger: {
     trackingIdHeader: string;
    };
}>;
```
