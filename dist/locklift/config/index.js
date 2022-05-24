"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
const superstruct_1 = require("superstruct");
const core_1 = require("@tonclient/core");
const lib_node_1 = require("@tonclient/lib-node");
core_1.TonClient.useBinaryLibrary(lib_node_1.libNode);
const Compiler = (0, superstruct_1.object)({
    path: (0, superstruct_1.defaulted)((0, superstruct_1.string)(), () => '/usr/bin/solc-ton'),
});
const Linker = (0, superstruct_1.object)({
    path: (0, superstruct_1.defaulted)((0, superstruct_1.string)(), () => '/usr/bin/tvm_linker'),
    lib: (0, superstruct_1.any)(),
});
const Giver = (0, superstruct_1.object)({
    address: (0, superstruct_1.string)(),
    abi: (0, superstruct_1.object)(),
    key: (0, superstruct_1.string)(),
});
const Keys = (0, superstruct_1.object)({
    phrase: (0, superstruct_1.string)(),
    amount: (0, superstruct_1.defaulted)((0, superstruct_1.integer)(), () => 25),
    path: (0, superstruct_1.defaulted)((0, superstruct_1.string)(), () => "m/44'/396'/0'/0/INDEX"),
});
const Network = (0, superstruct_1.object)({
    ton_client: (0, superstruct_1.any)(),
    giver: Giver,
    keys: Keys,
});
const Config = (0, superstruct_1.object)({
    compiler: Compiler,
    linker: Linker,
    networks: (0, superstruct_1.record)((0, superstruct_1.string)(), Network),
});
async function loadConfig(configPath) {
    const resolvedConfigPath = path_1.default.resolve(process.cwd(), configPath);
    if (!fs_1.default.existsSync(resolvedConfigPath)) {
        throw new commander_1.default.InvalidOptionArgumentError(`Config at ${configPath} not found!`);
    }
    const configFile = require(resolvedConfigPath);
    const config = (0, superstruct_1.create)(configFile, Config);
    function genHexString(len) {
        const str = Math.floor(Math.random() * Math.pow(16, len)).toString(16);
        return '0'.repeat(len - str.length) + str;
    }
    const client = new core_1.TonClient();
    config.networks = await Object.entries(config.networks).reduce(async (accP, [network, networkConfig]) => {
        const acc = await accP;
        if (networkConfig.keys.phrase === '') {
            const entropy = genHexString(32);
            const { phrase } = await client.crypto.mnemonic_from_entropy({
                entropy,
                word_count: 12,
            });
            networkConfig.keys.phrase = phrase;
        }
        return Object.assign(Object.assign({}, acc), { [network]: networkConfig });
    }, Promise.resolve({}));
    return config;
}
exports.loadConfig = loadConfig;
//# sourceMappingURL=index.js.map