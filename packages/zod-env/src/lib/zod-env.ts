import { z } from 'zod';
import { loadYamlEnvOptions, YamlFileOptions } from './z-yaml-loader';

/**
 * 用于加载和管理配置的功能类
 * @see {@link AppConfig}
 * @remarks
 * 该类封装了配置文件的加载和验证过程，并提供类型安全的配置访问方式。
 * 使用`ZodSchema`进行配置验证，采用`YAML`格式文档作为配置文件。
 *
 * @typeParam T - 配置对象的类型
 *
 * 一般来说，每个项目都会有配置文件的加载和验证的过程，这部分的逻辑是通用的。
 * 不同的项目差异体现在配置对象的类型和验证规则的定义，所以，我们应该把这部分逻辑从代码中分离出来。
 * 交由消费者在调用时来完成，从而增强代码的可复用性和灵活性。
 *
 * 通过泛型参数`T`，我们把差异化的部分——配置对象的类型定义和验证规则定义，隔离在类的外部，由消费者根据项目的需求完成这部分逻辑代码的编写，
 * 并通过调用本类来复用配置文件的加载和验证过程的逻辑。
 *
 * 同时，配置内容封装为类的成员，使IDE能提供自动完成和类型检查功能，提高开发效率。
 * @see {@link typedoc} 查看更多
 * @see your developer SDK for code samples
 *
 * @document externaldocs/demo.md
 *
 * @example
 * ```typescript
 * // 定义配置schema
 * const configSchema = z.object({
 *   port: z.number(),
 *   host: z.string(),
 *   database: z.object({
 *     url: z.string()
 *   })
 * });
 *
 * // 创建ZodEnv实例
 * const env = new ZodEnv(configSchema, {
 *   configDir: './config',
 *   configFilePrefix: 'app'
 * });
 *
 * // 使用配置
 * const config = env.config;
 * console.log(config.port);    // 类型安全的访问
 * console.log(config.host);    // IDE会提供自动完成
 * ```
 * @see {@link https://tools.ietf.org/html/rfc1738| RFC 1738}
 *
 * [RFC 1738](https://tools.ietf.org/html/rfc1738)
 *
 * ![RFC 1738](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/3w7jaH3B0aNtw8NPhF6CPm/8af4c055c48aa7b1a2ffcdaf341117bf/511102367_1ce398ad1d_o.png)
 */
export class ZodEnv<T> {
  /** 存储验证后的配置对象 */
  private _config: T;

  /**
   * 用于创建ZodEnv实例
   * @param schema - 用于验证配置的Zod Schema
   * @param options - YAML配置文件的选项
   */
  constructor(schema: z.ZodType<T>, options: YamlFileOptions) {
    const config = loadYamlEnvOptions(options, schema);
    this._config = config;
  }

  /**
   * 获取验证后的配置对象
   * @returns 类型安全的配置对象
   */
  get config(): T {
    return this._config;
  }
}
