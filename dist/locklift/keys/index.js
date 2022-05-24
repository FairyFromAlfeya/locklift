"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keys = void 0;
const index_1 = __importDefault(require("../index"));
class Keys {
    constructor(locklift) {
        this.locklift = locklift;
        this.keyPairs = [];
    }
    async getKeyPairs() {
        return this.keyPairs;
    }
    async setup() {
        const keysHDPaths = [
            ...Array(this.locklift.networkConfig.keys.amount).keys(),
        ].map((i) => this.locklift.networkConfig.keys.path.replace('INDEX', i));
        if (process.platform !== 'darwin') {
            this.keyPairs = await Promise.all(keysHDPaths.map(async (path) => {
                return index_1.default.ton.client.crypto.mnemonic_derive_sign_keys({
                    dictionary: 1,
                    word_count: 12,
                    phrase: this.locklift.networkConfig.keys.phrase,
                    path,
                });
            }));
        }
        else {
            for (const path of keysHDPaths) {
                this.keyPairs.push(await index_1.default.ton.client.crypto.mnemonic_derive_sign_keys({
                    dictionary: 1,
                    word_count: 12,
                    phrase: this.locklift.networkConfig.keys.phrase,
                    path,
                }));
            }
        }
    }
}
exports.Keys = Keys;
//# sourceMappingURL=index.js.map