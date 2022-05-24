"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ton = void 0;
const bignumber_js_1 = require("bignumber.js");
const core_1 = require("@tonclient/core");
const lib_node_1 = require("@tonclient/lib-node");
const index_1 = __importDefault(require("../index"));
core_1.TonClient.useBinaryLibrary(lib_node_1.libNode);
class Ton {
    constructor(locklift) {
        this.locklift = locklift;
        this.client = new core_1.TonClient(this.locklift.config.networks[this.locklift.network].ton_client);
        this.zero_address =
            '0:0000000000000000000000000000000000000000000000000000000000000000';
    }
    async createDeployMessage({ contract, constructorParams, initParams, keyPair, }) {
        const encodeParams = {
            abi: {
                type: 'Contract',
                value: contract.abi,
            },
            deploy_set: {
                tvc: contract.base64,
                initial_data: initParams,
            },
            call_set: {
                function_name: 'constructor',
                input: constructorParams === undefined ? {} : constructorParams,
            },
            signer: {
                type: 'None',
            },
        };
        return index_1.default.ton.client.abi.encode_message(this.enrichMessageWithKeys(encodeParams, keyPair));
    }
    enrichMessageWithKeys(encodeParams, keyPair) {
        return keyPair === undefined
            ? encodeParams
            : Object.assign(Object.assign({}, encodeParams), { signer: {
                    type: 'Keys',
                    keys: keyPair,
                } });
    }
    async createRunMessage({ contract, method, params, keyPair }) {
        const encodeParams = {
            address: contract.address,
            abi: {
                type: 'Contract',
                value: contract.abi,
            },
            call_set: {
                function_name: method,
                input: params,
            },
            signer: {
                type: 'None',
            },
        };
        return index_1.default.ton.client.abi.encode_message(this.enrichMessageWithKeys(encodeParams, keyPair));
    }
    async waitForRunTransaction({ message, abi }) {
        const { shard_block_id } = await index_1.default.ton.client.processing.send_message({
            message: message.message,
            send_events: false,
        });
        return index_1.default.ton.client.processing.wait_for_transaction({
            message: message.message,
            shard_block_id,
            send_events: false,
            abi: {
                type: 'Contract',
                value: abi,
            },
        });
    }
    async getBalance(address) {
        const { result: [{ balance }], } = await this.client.net.query_collection({
            collection: 'accounts',
            filter: {
                id: { eq: address },
            },
            result: 'balance',
        });
        return new bignumber_js_1.BigNumber(balance);
    }
    async getAccountType(address) {
        const { result: [{ acc_type, acc_type_name }], } = await this.client.net.query_collection({
            collection: 'accounts',
            filter: {
                id: { eq: address },
            },
            result: 'acc_type acc_type_name',
        });
        return {
            acc_type,
            acc_type_name,
        };
    }
}
exports.Ton = Ton;
//# sourceMappingURL=index.js.map