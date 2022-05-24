"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const locklift_1 = __importDefault(require("./../../locklift"));
let Sample;
let sample;
const getRandomNonce = () => (Math.random() * 64000) | 0;
describe('Test Sample contract', async function () {
    describe('Contracts', async function () {
        it('Load contract factory', async function () {
            Sample = await locklift_1.default.factory.getContract('Sample');
            (0, chai_1.expect)(Sample.code).not.to.equal(undefined, 'Code should be available');
            (0, chai_1.expect)(Sample.abi).not.to.equal(undefined, 'ABI should be available');
        });
        it('Deploy contract', async function () {
            this.timeout(20000);
            const [keyPair] = await locklift_1.default.keys.getKeyPairs();
            sample = await locklift_1.default.giver.deployContract({
                contract: Sample,
                constructorParams: {
                    _state: 123,
                },
                initParams: {
                    _nonce: getRandomNonce(),
                },
                keyPair,
            });
            (0, chai_1.expect)(sample.address)
                .to.be.a('string')
                .and.satisfy((s) => s.startsWith('0:'), 'Bad future address');
        });
        it('Interact with contract', async function () {
            await sample.run({
                method: 'setState',
                params: { _state: 111 },
            });
            const response = await sample.call({
                method: 'getDetails',
                params: {},
            });
            (0, chai_1.expect)(response.toNumber()).to.be.equal(111, 'Wrong state');
        });
    });
});
//# sourceMappingURL=Sample.spec.js.map