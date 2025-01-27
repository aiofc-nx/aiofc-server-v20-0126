/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const config_module_1 = __webpack_require__(7);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_module_1.ConfigModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_service_1 = __webpack_require__(8);
/**
 * ConfigModule
 *
 * 职责：
 * 1. 提供全局配置服务
 * 2. 管理配置的加载和注入
 * 3. 确保配置的单例性
 */
let ConfigModule = class ConfigModule {
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: config_service_1.ConfigService,
        exports: config_service_1.ConfigService,
    })
], ConfigModule);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigService = void 0;
const env_config_1 = __webpack_require__(9);
exports.ConfigService = [env_config_1.EnvConfig];


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnvConfig = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const zod_env_1 = __webpack_require__(10);
const path_1 = __webpack_require__(14);
const env_schema_1 = __webpack_require__(16);
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
let EnvConfig = class EnvConfig extends zod_env_1.ZodEnv {
    constructor() {
        super(env_schema_1.EnvSchema, {
            configDir: (0, path_1.join)(__dirname, '/assets'),
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
};
exports.EnvConfig = EnvConfig;
exports.EnvConfig = EnvConfig = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], EnvConfig);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(11), exports);
tslib_1.__exportStar(__webpack_require__(15), exports);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadYamlEnvOptions = void 0;
const tslib_1 = __webpack_require__(4);
const fs_1 = __webpack_require__(12);
const yaml = tslib_1.__importStar(__webpack_require__(13));
const path_1 = __webpack_require__(14);
/**
 * 构建配置文件路径
 * @param options 配置文件选项
 * @returns 配置文件路径
 * @throws 当未提供必需的configFilePrefix时抛出错误
 */
const buildConfigPath = (options) => {
    if (!options.configFilePrefix) {
        throw new Error('configFilePrefix is required');
    }
    const env = process.env['NODE_ENV'] || 'development';
    const prefix = options.configFilePrefix;
    const configDir = options.configDir || (0, path_1.join)(__dirname, 'assets');
    return (0, path_1.join)(configDir, `${prefix}.${env}.yaml`);
};
/**
 * 读取YAML文件内容
 * @param filePath 配置文件路径
 * @returns 配置文件内容
 */
const readYamlFile = (filePath) => {
    // console.log('获取配置文件', filePath);
    if (!(0, fs_1.existsSync)(filePath)) {
        throw new Error(`配置文件不存在: ${filePath}`);
    }
    const content = (0, fs_1.readFileSync)(filePath, 'utf8');
    return yaml.load(content);
};
/**
 * 配置验证函数
 * @param config 待验证的配置对象
 * @returns 经过验证和类型转换的配置对象
 * @throws 当验证失败时抛出错误
 */
const envValidate = (config, schema) => {
    try {
        const validated = schema.parse(config);
        console.log('验证通过:', JSON.stringify(validated, null, 2));
        // process.env['NODE_ENV'] = config['NODE_ENV'] as string;
        console.log('配置参数验证通过，当前环境:', process.env['NODE_ENV']);
        return validated;
    }
    catch (error) {
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
const loadYamlEnvOptions = (options, schema) => {
    try {
        const configPath = buildConfigPath(options);
        const config = readYamlFile(configPath);
        return envValidate(config, schema);
    }
    catch (error) {
        console.error('配置加载失败:', error);
        // 测试环境下直接抛出错误，而不是退出进程
        if (process.env['NODE_ENV'] === 'test') {
            throw error;
        }
        process.exit(1);
    }
};
exports.loadYamlEnvOptions = loadYamlEnvOptions;


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("js-yaml");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZodEnv = void 0;
const z_yaml_loader_1 = __webpack_require__(11);
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
class ZodEnv {
    /**
     * 用于创建ZodEnv实例
     * @param schema - 用于验证配置的Zod Schema
     * @param options - YAML配置文件的选项
     */
    constructor(schema, options) {
        const config = (0, z_yaml_loader_1.loadYamlEnvOptions)(options, schema);
        this._config = config;
    }
    /**
     * 获取验证后的配置对象
     * @returns 类型安全的配置对象
     */
    get config() {
        return this._config;
    }
}
exports.ZodEnv = ZodEnv;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnvSchema = void 0;
const zod_1 = __webpack_require__(17);
const app_constant_1 = __webpack_require__(18);
exports.EnvSchema = zod_1.z.object({
    /**
     * API服务配置部分
     */
    app: zod_1.z.object({
        port: zod_1.z.coerce.number().default(3000), // API服务端口，默认3000
        globalPrefix: zod_1.z.string().default('api'), // API全局路由前缀，默认'api'
        NODE_ENV: zod_1.z
            .enum([app_constant_1.Environment.DEVELOPMENT, app_constant_1.Environment.PRODUCTION, app_constant_1.Environment.TEST])
            .default(app_constant_1.Environment.DEVELOPMENT), // 环境变量，默认'development'
    }),
    /**
     * 日志配置部分
     */
    logger: zod_1.z.object({
        trackingIdHeader: zod_1.z.coerce.string().optional(), // 可选的追踪ID请求头
    }),
    /**
     * 数据库配置部分
     */
    database: zod_1.z.object({
        user: zod_1.z.string(), // 数据库用户名
        password: zod_1.z.string(), // 数据库密码
        host: zod_1.z.string(), // 数据库主机地址
        port: zod_1.z.coerce.number().default(5432),
        name: zod_1.z.string(), // 数据库名称
        systemSchema: zod_1.z.string(), // 系统Schema（用于存储租户信息等系统表）
        pool: zod_1.z
            .object({
            max: zod_1.z.number().optional(),
            min: zod_1.z.number().optional(),
            idle_timeout: zod_1.z.number().optional(),
            connect_timeout: zod_1.z.number().optional(),
            max_lifetime: zod_1.z.number().optional(),
        })
            .optional(),
        isolationStrategy: zod_1.z.enum(['schema', 'row']).default('row'), // 租户隔离策略：schema=独立Schema隔离，row=行级安全隔离
    }),
});


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("zod");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SYSTEM_USER_ID = exports.DEFAULT_CURRENT_PAGE = exports.DEFAULT_PAGE_LIMIT = exports.loggingRedactPaths = exports.Order = exports.LogService = exports.Environment = exports.IS_AUTH_OPTIONAL = exports.IS_PUBLIC = void 0;
/** 标记路由为公开访问(无需认证) */
exports.IS_PUBLIC = 'isPublic';
/** 标记路由为可选认证 */
exports.IS_AUTH_OPTIONAL = 'isAuthOptional';
/**
 * 环境枚举
 * @enum {string}
 */
var Environment;
(function (Environment) {
    /** 本地环境 */
    Environment["LOCAL"] = "local";
    /** 开发环境 */
    Environment["DEVELOPMENT"] = "development";
    /** 预发布环境 */
    Environment["STAGING"] = "staging";
    /** 生产环境 */
    Environment["PRODUCTION"] = "production";
    /** 测试环境 */
    Environment["TEST"] = "test";
})(Environment || (exports.Environment = Environment = {}));
/**
 * 日志服务枚举
 * @enum {string}
 */
var LogService;
(function (LogService) {
    /** 控制台日志 */
    LogService["CONSOLE"] = "console";
    /** Google Cloud Logging 服务 */
    LogService["GOOGLE_LOGGING"] = "google_logging";
    /** AWS CloudWatch 日志服务 */
    LogService["AWS_CLOUDWATCH"] = "aws_cloudwatch";
})(LogService || (exports.LogService = LogService = {}));
/**
 * 排序方向枚举
 * @enum {string}
 */
var Order;
(function (Order) {
    /** 升序 */
    Order["ASC"] = "ASC";
    /** 降序 */
    Order["DESC"] = "DESC";
})(Order || (exports.Order = Order = {}));
/** 需要在日志中隐藏的敏感信息路径 */
exports.loggingRedactPaths = [
    'req.headers.authorization',
    'req.body.token',
    'req.body.refreshToken',
    'req.body.email',
    'req.body.password',
    'req.body.oldPassword',
];
/** 默认分页大小 */
exports.DEFAULT_PAGE_LIMIT = 10;
/** 默认当前页码 */
exports.DEFAULT_CURRENT_PAGE = 1;
/** 系统用户ID */
exports.SYSTEM_USER_ID = 'system';


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map