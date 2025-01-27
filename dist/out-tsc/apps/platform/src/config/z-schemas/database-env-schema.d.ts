import { z } from 'zod';
export declare const DatabaseEnvSchema: z.ZodObject<{
    /**
     * 数据库配置部分
     */
    database: z.ZodObject<{
        user: z.ZodString;
        password: z.ZodString;
        host: z.ZodString;
        port: z.ZodDefault<z.ZodNumber>;
        name: z.ZodString;
        systemSchema: z.ZodString;
        pool: z.ZodOptional<z.ZodObject<{
            max: z.ZodOptional<z.ZodNumber>;
            min: z.ZodOptional<z.ZodNumber>;
            idle_timeout: z.ZodOptional<z.ZodNumber>;
            connect_timeout: z.ZodOptional<z.ZodNumber>;
            max_lifetime: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            max?: number;
            min?: number;
            idle_timeout?: number;
            connect_timeout?: number;
            max_lifetime?: number;
        }, {
            max?: number;
            min?: number;
            idle_timeout?: number;
            connect_timeout?: number;
            max_lifetime?: number;
        }>>;
        isolationStrategy: z.ZodDefault<z.ZodEnum<["schema", "row"]>>;
    }, "strip", z.ZodTypeAny, {
        port?: number;
        user?: string;
        password?: string;
        host?: string;
        name?: string;
        systemSchema?: string;
        pool?: {
            max?: number;
            min?: number;
            idle_timeout?: number;
            connect_timeout?: number;
            max_lifetime?: number;
        };
        isolationStrategy?: "schema" | "row";
    }, {
        port?: number;
        user?: string;
        password?: string;
        host?: string;
        name?: string;
        systemSchema?: string;
        pool?: {
            max?: number;
            min?: number;
            idle_timeout?: number;
            connect_timeout?: number;
            max_lifetime?: number;
        };
        isolationStrategy?: "schema" | "row";
    }>;
}, "strip", z.ZodTypeAny, {
    database?: {
        port?: number;
        user?: string;
        password?: string;
        host?: string;
        name?: string;
        systemSchema?: string;
        pool?: {
            max?: number;
            min?: number;
            idle_timeout?: number;
            connect_timeout?: number;
            max_lifetime?: number;
        };
        isolationStrategy?: "schema" | "row";
    };
}, {
    database?: {
        port?: number;
        user?: string;
        password?: string;
        host?: string;
        name?: string;
        systemSchema?: string;
        pool?: {
            max?: number;
            min?: number;
            idle_timeout?: number;
            connect_timeout?: number;
            max_lifetime?: number;
        };
        isolationStrategy?: "schema" | "row";
    };
}>;
export type DatabaseValidatedConfig = z.infer<typeof DatabaseEnvSchema>;
