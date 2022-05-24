"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = require("./commands/init");
const build_1 = require("./commands/build");
const test_1 = require("./commands/test");
const run_1 = require("./commands/run");
const gendoc_1 = require("./commands/gendoc");
const package_json_1 = __importDefault(require("./../../package.json"));
commander_1.program.addCommand(init_1.program);
commander_1.program.addCommand(build_1.program);
commander_1.program.addCommand(test_1.program);
commander_1.program.addCommand(run_1.program);
commander_1.program.addCommand(gendoc_1.program);
commander_1.program.version(package_json_1.default.version);
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map