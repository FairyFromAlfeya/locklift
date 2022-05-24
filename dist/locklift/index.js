"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const giver_1 = require("./giver");
const keys_1 = require("./keys");
const ton_1 = require("./ton");
const utils = __importStar(require("./utils"));
class Locklift {
    constructor(config, network) {
        this.config = config;
        this.network = network;
        this.networkConfig = this.config.networks[this.network];
    }
    async setup() {
        Locklift.ton = new ton_1.Ton(this);
        Locklift.factory = new factory_1.Factory(this);
        Locklift.giver = new giver_1.Giver(this);
        Locklift.keys = new keys_1.Keys(this);
        Locklift.utils = utils;
        await Locklift.giver.setup();
        await Locklift.keys.setup();
    }
}
exports.default = Locklift;
//# sourceMappingURL=index.js.map