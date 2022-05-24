"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const config_1 = require("../../config");
const utils_1 = require("../utils");
exports.program = new commander_1.Command()
    .name('gendoc')
    .description('Generate smart contracts documentation from the natspec comments')
    .option('-c, --contracts <contracts>', 'Path to the contracts folder', 'contracts')
    .option('-b, --build <build>', 'Path to the build folder', 'build')
    .option('--disable-include-path', 'Disables including node_modules. Use this with old compiler versions', false)
    .option('-d, --docs <docs>', 'Path to the docs folder', 'docs')
    .option('-i, --include <include>', 'Generate docs only for contracts, whose name matches the patters', '.*')
    .addOption(new commander_1.Option('-m, --mode <mode>', 'Mode for compiler doc generator')
    .default('devdoc')
    .choices(['devdoc', 'userdoc']))
    .requiredOption('--config <config>', 'Path to the config file', async (config) => (0, config_1.loadConfig)(config))
    .action(async (options) => {
    const config = await options.config;
    (0, utils_1.initializeDirIfNotExist)(options.build);
    (0, utils_1.initializeDirIfNotExist)(options.docs);
    const builder = new utils_1.Builder(config, options);
    try {
        const status = builder.buildDocs();
        if (status === false) {
            process.exit(1);
        }
        else {
            process.exit(0);
        }
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=gendoc.js.map