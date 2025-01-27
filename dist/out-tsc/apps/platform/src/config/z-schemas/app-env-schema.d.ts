import { z } from 'zod';
import { Environment } from '../../common/constants/app.constant';
export declare const AppEnvSchema: z.ZodObject<{
    /**
     * API服务配置部分
     */
    app: z.ZodObject<{
        port: z.ZodDefault<z.ZodNumber>;
        globalPrefix: z.ZodDefault<z.ZodString>;
        NODE_ENV: z.ZodDefault<z.ZodEnum<[Environment.DEVELOPMENT, Environment.PRODUCTION, Environment.TEST]>>;
    }, "strip", z.ZodTypeAny, {
        port?: number;
        globalPrefix?: string;
        NODE_ENV?: Environment.DEVELOPMENT | Environment.PRODUCTION | Environment.TEST;
    }, {
        port?: number;
        globalPrefix?: string;
        NODE_ENV?: Environment.DEVELOPMENT | Environment.PRODUCTION | Environment.TEST;
    }>;
    /**
     * 日志配置部分
     */
    logger: z.ZodObject<{
        trackingIdHeader: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        trackingIdHeader?: string;
    }, {
        trackingIdHeader?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    app?: {
        port?: number;
        globalPrefix?: string;
        NODE_ENV?: Environment.DEVELOPMENT | Environment.PRODUCTION | Environment.TEST;
    };
    logger?: {
        trackingIdHeader?: string;
    };
}, {
    app?: {
        port?: number;
        globalPrefix?: string;
        NODE_ENV?: Environment.DEVELOPMENT | Environment.PRODUCTION | Environment.TEST;
    };
    logger?: {
        trackingIdHeader?: string;
    };
}>;
export type AppValidatedConfig = z.infer<typeof AppEnvSchema>;
