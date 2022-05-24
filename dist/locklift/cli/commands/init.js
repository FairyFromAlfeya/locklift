"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("../utils");
exports.program = new commander_1.Command()
    .name('init')
    .description('Initialize sample Locklift project in a directory')
    .requiredOption('-p, --path <path>', 'Path to the project folder', '.')
    .option('-f, --force', 'Ignore non-empty path', false)
    .action((options) => {
    const pathEmpty = (0, utils_1.checkDirEmpty)(options.path);
    if (!pathEmpty && options.force === false) {
        console.error(`Directory at ${options.path} should be empty!`);
        return;
    }
    const sampleProjectPath = path_1.default.resolve(__dirname, './../../../sample-project');
    fs_extra_1.default.copy(sampleProjectPath, options.path, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`New Locklift project initialized in ${options.path}`);
    });
});
//# sourceMappingURL=init.js.map