import { BigNumber } from 'bignumber.js';
import { TonClient } from '@tonclient/core';
import Locklift from '../index';
export declare class Ton {
    zero_address: string;
    client: TonClient;
    locklift: Locklift;
    constructor(locklift: any);
    createDeployMessage({ contract, constructorParams, initParams, keyPair, }: {
        contract: any;
        constructorParams: any;
        initParams: any;
        keyPair: any;
    }): Promise<import("@tonclient/core").ResultOfEncodeMessage>;
    enrichMessageWithKeys(encodeParams: any, keyPair: any): any;
    createRunMessage({ contract, method, params, keyPair }: {
        contract: any;
        method: any;
        params: any;
        keyPair: any;
    }): Promise<import("@tonclient/core").ResultOfEncodeMessage>;
    waitForRunTransaction({ message, abi }: {
        message: any;
        abi: any;
    }): Promise<import("@tonclient/core").ResultOfProcessMessage>;
    getBalance(address: any): Promise<BigNumber>;
    getAccountType(address: any): Promise<{
        acc_type: any;
        acc_type_name: any;
    }>;
}
