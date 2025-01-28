import { Injectable } from '@nestjs/common';
import { ZodEnv } from '@aiofc/zod-env';
import { join } from 'path';
import { EnvSchema, EnvValidatedConfig } from './env-schema';

/**
 * EnvService 类
 *
 * 这是一个工具类，负责把经过验证的环境变量（EnvValidatedConfig）分解为若干个配置组，
 * 这些配置组被暴露为属性，供应用程序使用。
 *
 * 职责：
 * 1. 管理应用程序的配置
 * 2. 通过依赖注入提供配置数据
 * 3. 提供类型安全的配置访问接口
 */
@Injectable()
export class ConfigService extends ZodEnv<EnvValidatedConfig> {
  constructor() {
    super(EnvSchema, {
      configDir: join(__dirname, '/assets'),
      configFilePrefix: 'app.config',
    });
  }

  get app() {
    return Object.freeze({ ...this.config.app });
  }

  get logger() {
    return Object.freeze({ ...this.config.logger });
  }

  get database() {
    return Object.freeze({ ...this.config.database });
  }
}
