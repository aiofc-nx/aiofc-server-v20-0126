import { readFileSync, existsSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
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
 * 构建配置文件路径
 * @param options 配置文件选项
 * @returns 配置文件路径
 * @throws 当未提供必需的configFilePrefix时抛出错误
 */
const buildConfigPath = (options: YamlFileOptions): string => {
  if (!options.configFilePrefix) {
    throw new Error('configFilePrefix is required');
  }

  const env = process.env['NODE_ENV'] || 'development';
  const prefix = options.configFilePrefix;
  const configDir = options.configDir || join(__dirname, 'assets');

  return join(configDir, `${prefix}.${env}.yaml`);
};

/**
 * 读取YAML文件内容
 * @param filePath 配置文件路径
 * @returns 配置文件内容
 */
const readYamlFile = (filePath: string): Record<string, unknown> => {
  // console.log('获取配置文件', filePath);
  if (!existsSync(filePath)) {
    throw new Error(`配置文件不存在: ${filePath}`);
  }

  const content = readFileSync(filePath, 'utf8');
  return yaml.load(content) as Record<string, unknown>;
};

/**
 * 配置验证函数
 * @param config 待验证的配置对象
 * @returns 经过验证和类型转换的配置对象
 * @throws 当验证失败时抛出错误
 */
const envValidate = <T>(
  config: Record<string, unknown>,
  schema: z.ZodSchema<T>,
): T => {
  try {
    const validated = schema.parse(config);
    console.log('验证通过:', JSON.stringify(validated, null, 2));
    // process.env['NODE_ENV'] = config['NODE_ENV'] as string;
    console.log('配置参数验证通过，当前环境:', process.env['NODE_ENV']);
    return validated;
  } catch (error) {
    console.error('验证失败:', error);
    throw error;
  }
};

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
export const loadYamlEnvOptions = <T>(
  options: YamlFileOptions,
  schema: z.ZodSchema<T>,
): T => {
  try {
    const configPath = buildConfigPath(options);
    const config = readYamlFile(configPath);
    return envValidate(config, schema);
  } catch (error) {
    console.error('配置加载失败:', error);
    // 测试环境下直接抛出错误，而不是退出进程
    if (process.env['NODE_ENV'] === 'test') {
      throw error;
    }
    process.exit(1);
  }
};
