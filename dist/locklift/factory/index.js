"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const contract_1 = require("../contract");
const account_1 = require("../contract/account");
const index_1 = __importDefault(require("../index"));
class Factory {
    constructor(locklift) {
        this.locklift = locklift;
    }
    async initializeContract(name, resolvedPath) {
        const base64 = (0, utils_1.loadBase64FromFile)(`${resolvedPath}/${name}.base64`);
        const abi = (0, utils_1.loadJSONFromFile)(`${resolvedPath}/${name}.abi.json`);
        const { code } = await index_1.default.ton.client.boc.get_code_from_tvc({
            tvc: base64,
        });
        return new contract_1.Contract({
            locklift: this.locklift,
            abi,
            base64,
            code,
            name,
        });
    }
    async getContract(name, build = 'build') {
        const resolvedBuildPath = path_1.default.resolve(process.cwd(), build);
        return this.initializeContract(name, resolvedBuildPath);
    }
    async getAccount(name = 'Account', build = 'build') {
        const resolvedBuildPath = path_1.default.resolve(process.cwd(), build);
        const contract = await this.initializeContract(name, resolvedBuildPath);
        return new account_1.Account({
            locklift: this.locklift,
            abi: contract.abi,
            base64: contract.base64,
            code: contract.code,
            name: contract.name,
        });
    }
}
exports.Factory = Factory;
//# sourceMappingURL=index.js.map