"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const index_1 = require("./index");
const index_2 = __importDefault(require("../index"));
class Account extends index_1.Contract {
    async runTarget({ contract, method, params, value, keyPair }) {
        let body = '';
        if (method !== undefined) {
            const extendedParams = params === undefined ? {} : params;
            if (this.autoAnswerIdOnCall) {
                if (contract.abi.functions
                    .find((e) => e.name === method)
                    .inputs.find((e) => e.name === '_answer_id')) {
                    extendedParams._answer_id =
                        extendedParams._answer_id === undefined
                            ? 1
                            : extendedParams._answer_id;
                }
                else if (contract.abi.functions
                    .find((e) => e.name === method)
                    .inputs.find((e) => e.name === 'answerId')) {
                    extendedParams.answerId =
                        extendedParams.answerId === undefined ? 1 : extendedParams.answerId;
                }
            }
            const message = await index_2.default.ton.client.abi.encode_message_body({
                abi: {
                    type: 'Contract',
                    value: contract.abi,
                },
                call_set: {
                    function_name: method,
                    input: extendedParams,
                },
                signer: {
                    type: 'None',
                },
                is_internal: true,
            });
            body = message.body;
        }
        return this.run({
            method: 'sendTransaction',
            params: {
                dest: contract.address,
                value: value === undefined
                    ? index_2.default.utils.convertCrystal('2', 'nano')
                    : value,
                bounce: true,
                flags: 0,
                payload: body,
            },
            keyPair: keyPair === undefined ? this.keyPair : keyPair,
        });
    }
}
exports.Account = Account;
//# sourceMappingURL=account.js.map