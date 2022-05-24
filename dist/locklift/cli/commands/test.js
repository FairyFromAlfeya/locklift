"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const mocha_1 = __importDefault(require("mocha"));
const path_1 = __importDefault(require("path"));
const directory_tree_1 = __importDefault(require("directory-tree"));
const config_1 = require("../../config");
const index_1 = __importDefault(require("../../index"));
const utils_1 = require("../utils");
exports.program = new commander_1.Command()
    .name('test')
    .description('Run mocha tests')
    .option('--disable-build', 'Disable automatic contracts build', false)
    .option('-t, --test <test>', 'Path to Mocha test folder', 'test')
    .option('-c, --contracts <contracts>', 'Path to the contracts folder', 'contracts')
    .option('-b, --build <build>', 'Path to the build folder', 'build')
    .option('--disable-include-path', 'Disables including node_modules. Use this with old compiler versions', false)
    .requiredOption('-n, --network <network>', 'Network to use, choose from configuration')
    .requiredOption('--config <config>', 'Path to the config file', async (config) => (0, config_1.loadConfig)(config))
    .option('--tests [tests...]', 'Set of tests to run, separated by comma')
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
    const mocha = new mocha_1.default();
    let testFiles;
    if (Array.isArray(options.tests)) {
        testFiles = options.tests;
    }
    else {
        const testNestedTree = (0, directory_tree_1.default)(path_1.default.resolve(process.cwd(), options.test), { extensions: /\.js/ });
        testFiles = (0, utils_1.flatDirTree)(testNestedTree).map((t) => t.path);
    }
    testFiles.forEach((file) => mocha.addFile(file));
    mocha.run((fail) => process.exit(fail ? 1 : 0));
});
//# sourceMappingURL=test.js.map