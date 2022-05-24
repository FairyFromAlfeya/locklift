"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giver = void 0;
const contract_1 = require("../contract");
const index_1 = __importDefault(require("../index"));
class Giver {
    constructor(locklift) {
        this.locklift = locklift;
    }
    async deployContract({ contract, constructorParams, initParams, keyPair }, amount = index_1.default.utils.convertCrystal(10, 'nano')) {
        const extendedInitParams = initParams === undefined ? {} : initParams;
        if (contract.autoRandomNonce) {
            if (contract.abi.data.find((e) => e.name === '_randomNonce')) {
                extendedInitParams._randomNonce =
                    extendedInitParams._randomNonce === undefined
                        ? index_1.default.utils.getRandomNonce()
                        : extendedInitParams._randomNonce;
            }
        }
        const { address } = await index_1.default.ton.createDeployMessage({
            contract,
            constructorParams,
            initParams: extendedInitParams,
            keyPair,
        });
        await this.giver.run({
            method: 'sendGrams',
            params: {
                dest: address,
                amount,
            },
        });
        await index_1.default.ton.client.net.wait_for_collection({
            collection: 'accounts',
            filter: {
                id: { eq: address },
                balance: { gt: `0x0` },
            },
            result: 'balance',
        });
        const message = await index_1.default.ton.createDeployMessage({
            contract,
            constructorParams,
            initParams: extendedInitParams,
            keyPair,
        });
        await index_1.default.ton.waitForRunTransaction({
            message,
            abi: contract.abi,
        });
        contract.setAddress(address);
        return contract;
    }
    async setup() {
        this.giver = new contract_1.Contract({
            locklift: this.locklift,
            abi: this.locklift.networkConfig.giver.abi,
            address: this.locklift.networkConfig.giver.address,
            name: 'Giver',
        });
        if (this.locklift.networkConfig.giver.key) {
            const keyPair = await index_1.default.ton.client.crypto.nacl_sign_keypair_from_secret_key({
                secret: this.locklift.networkConfig.giver.key,
            });
            keyPair.secret = keyPair.secret.slice(0, 64);
            this.giver.setKeyPair(keyPair);
        }
    }
}
exports.Giver = Giver;
//# sourceMappingURL=index.js.map