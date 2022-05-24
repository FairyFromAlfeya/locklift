"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomNonce = () => (Math.random() * 64000) | 0;
const locklift_1 = __importDefault(require("./../../locklift"));
async function main() {
    const Sample = await locklift_1.default.factory.getContract('Sample');
    const [keyPair] = await locklift_1.default.keys.getKeyPairs();
    const sample = await locklift_1.default.giver.deployContract({
        contract: Sample,
        constructorParams: {
            _state: 123,
        },
        initParams: {
            _nonce: getRandomNonce(),
        },
        keyPair,
    });
    console.log(`Sample deployed at: ${sample.address}`);
}
main()
    .then(() => process.exit(0))
    .catch((e) => {
    console.log(e);
    process.exit(1);
});
//# sourceMappingURL=1-deploy-sample.js.map