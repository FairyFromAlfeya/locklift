"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const output_decoder_1 = require("./output-decoder");
const ton_client_js_1 = require("ton-client-js");
const index_1 = __importDefault(require("../index"));
class Contract {
    constructor({ locklift, abi, base64, code, name, address, keyPair, autoAnswerIdOnCall, autoRandomNonce, afterRun, }) {
        this.locklift = locklift;
        this.abi = abi;
        this.base64 = base64;
        this.code = code;
        this.name = name;
        this.address = address;
        this.keyPair = keyPair;
        this.afterRun = afterRun === undefined ? async () => { } : afterRun;
        this.autoAnswerIdOnCall =
            autoAnswerIdOnCall === undefined ? true : autoAnswerIdOnCall;
        this.autoRandomNonce =
            autoRandomNonce === undefined ? true : autoRandomNonce;
    }
    setAddress(address) {
        this.address = address;
    }
    setKeyPair(keyPair) {
        this.keyPair = keyPair;
    }
    async run({ method, params, keyPair, }) {
        const message = await index_1.default.ton.createRunMessage({
            contract: this,
            method,
            params: params === undefined ? {} : params,
            keyPair: keyPair === undefined ? this.keyPair : keyPair,
        });
        const tx = index_1.default.ton.waitForRunTransaction({
            message,
            abi: this.abi,
        });
        await this.afterRun(tx);
        return tx;
    }
    async call({ method, params, keyPair }) {
        const extendedParams = params === undefined ? {} : params;
        if (this.autoAnswerIdOnCall) {
            if (this.abi.functions
                .find((e) => e.name === method)
                .inputs.find((e) => e.name === '_answer_id')) {
                extendedParams._answer_id =
                    extendedParams._answer_id === undefined
                        ? 1
                        : extendedParams._answer_id;
            }
            else if (this.abi.functions
                .find((e) => e.name === method)
                .inputs.find((e) => e.name === 'answerId')) {
                extendedParams.answerId =
                    extendedParams.answerId === undefined ? 1 : extendedParams.answerId;
            }
        }
        const { message } = await index_1.default.ton.createRunMessage({
            contract: this,
            method,
            params: extendedParams,
            keyPair: keyPair === undefined ? this.keyPair : keyPair,
        });
        const { result: [{ boc }], } = await index_1.default.ton.client.net.query_collection({
            collection: 'accounts',
            filter: {
                id: {
                    eq: this.address,
                },
            },
            result: 'boc',
        });
        const { decoded: { output }, } = await index_1.default.ton.client.tvm.run_tvm({
            abi: {
                type: 'Contract',
                value: this.abi,
            },
            message: message,
            account: boc,
        });
        const functionAttributes = this.abi.functions.find(({ name }) => name === method);
        const outputDecoder = new output_decoder_1.OutputDecoder(output, functionAttributes);
        return outputDecoder.decode();
    }
    async decodeMessages(messages, is_internal) {
        const decodedMessages = messages.map(async (message) => {
            const decodedMessage = await index_1.default.ton.client.abi.decode_message_body({
                abi: {
                    type: 'Contract',
                    value: this.abi,
                },
                body: message.body,
                is_internal,
            });
            return Object.assign(Object.assign({}, decodedMessage), { messageId: message.id, src: message.src, created_at: message.created_at });
        });
        return Promise.all(decodedMessages);
    }
    async getSentMessages(messageType, internal) {
        const { result } = await index_1.default.ton.client.net.query_collection({
            collection: 'messages',
            filter: {
                src: {
                    eq: this.address,
                },
                msg_type: {
                    eq: messageType,
                },
            },
            result: 'body id src created_at',
        });
        return this.decodeMessages(result, internal);
    }
    async getEvents(eventName) {
        const sentMessages = await this.getSentMessages(ton_client_js_1.QMessageType.extOut, false);
        return sentMessages.filter((message) => message.name === eventName);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=index.js.map