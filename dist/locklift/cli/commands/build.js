"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const config_1 = require("../../config");
const utils_1 = require("../utils");
exports.program = new commander_1.Command()
    .name('build')
    .description('Build contracts by using TON Solidity compiler and TVM linker')
    .option('-c, --contracts <contracts>', 'Path to the contracts folder', 'contracts')
    .option('-b, --build <build>', 'Path to the build folder', 'build')
    .option('--disable-include-path', 'Disables including node_modules. Use this with old compiler versions', false)
    .requiredOption('--config <config>', 'Path to the config file', async (config) => (0, config_1.loadConfig)(config))
    .action(async (options) => {
    const config = await options.config;
    (0, utils_1.initializeDirIfNotExist)(options.build);
    const builder = new utils_1.Builder(config, options);
    const status = builder.buildContracts();
    if (status === false)
        process.exit(1);
    process.exit(0);
});
//# sourceMappingURL=build.js.map