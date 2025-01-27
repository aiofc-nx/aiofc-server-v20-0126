import { z } from 'zod';
/**
 * 接口用于描述配置文件（yaml）的设置选项
 * @remarks
 * 包括:
 * - 配置文件的存放目录
 * - 配置文件的文件名前缀
 * 通过这些选项，可以灵活地指定配置文件的存放位置和文件命名方式。
 *
 * 命名规则:
 * - 配置文件的文件名格式为: `{prefix}.{NODE_ENV}.yaml`
 *
 * @example
 * ```typescript
 * const options: YamlFileOptions = {
 *   configDir: '/path/to/config',    // 配置文件存放目录
 *   configFilePrefix: 'app'          // 生成的配置文件名将为: app.development.yaml
 * };
 * ```
 */
export interface YamlFileOptions {
    /**
     * 配置文件目录路径
     * @default process.cwd()/assets
     */
    configDir?: string;
    /**
     * 配置文件名称前缀
     * @default 'config'
     * @remarks 最终的配置文件名格式为: `{prefix}.{NODE_ENV}.yaml`
     */
    configFilePrefix: string;
}
/**
 * 用于加载配置文件（yaml）并验证设定环境变量的函数。
 * @remarks
 * 该函数会根据NODE_ENV环境变量加载对应的配置文件，并使用Zod schema进行验证。
 * 如果配置文件不存在或验证失败，则抛出错误并退出进程。
 *
 * @param options - 配置文件选项,用于指定配置文件的位置和前缀
 * @param schema - Zod schema对象,用于验证配置文件内容
 * @returns 经过验证的配置对象
 * @throws 当配置文件不存在或验证失败时退出进程
 * @example
 * ```typescript
 * // 定义配置schema
 * const configSchema = z.object({
 *   port: z.number(),
 *   host: z.string(),
 *   database: z.object({
 *     url: z.string(),
 *   })
 * });
 *
 * // 加载并验证配置
 * const config = loadYamlEnvOptions({
 *   configDir: './config',
 *   configFilePrefix: 'app'
 * }, configSchema);
 *
 * // 使用配置
 * console.log(config.port); // 类型安全的访问
 * ```
 */
export declare const loadYamlEnvOptions: <T>(options: YamlFileOptions, schema: z.ZodSchema<T>) => T;
