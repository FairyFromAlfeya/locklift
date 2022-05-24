"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const vm_1 = __importDefault(require("vm"));
const fs_1 = __importDefault(require("fs"));
const commander_1 = require("commander");
const config_1 = require("../../config");
const utils_1 = require("../utils");
const index_1 = __importDefault(require("./../../index"));
exports.program = new commander_1.Command()
    .name('run')
    .description('Run arbitrary locklift script')
    .option('--disable-build', 'Disable automatic contracts build', false)
    .option('-c, --contracts <contracts>', 'Path to the contracts folder', 'contracts')
    .option('-b, --build <build>', 'Path to the build folder', 'build')
    .option('--disable-include-path', 'Disables including node_modules. Use this with old compiler versions', false)
    .requiredOption('-n, --network <network>', 'Network to use, choose from configuration')
    .requiredOption('--config <config>', 'Path to the config file', async (config) => (0, config_1.loadConfig)(config))
    .requiredOption('-s, --script <script>', 'Script to run')
    .allowUnknownOption()
    .action(async (options) => {
    const config = await options.config;
    if (config.networks[options.network] === undefined) {
        console.error(`Can't find configuration for ${options.network} network!`);
        process.exit(1);
    }
    if (options.disableBuild !== true) {
        (0, utils_1.initializeDirIfNotExist)(options.build);
        const builder = new utils_1.Builder(config, options);
        const status = builder.buildContracts();
        if (status === false)
            process.exit(1);
    }
    const locklift = new index_1.default(config, options.network);
    await locklift.setup();
    global.locklift = locklift;
    global.__dirname = __dirname;
    const scriptCode = fs_1.default.readFileSync(options.script);
    const script = new vm_1.default.Script(scriptCode.toString());
    script.runInThisContext();
});
//# sourceMappingURL=run.js.map