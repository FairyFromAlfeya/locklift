import Locklift from '../index';
export declare class Contract {
    locklift: Locklift;
    abi: any;
    base64: any;
    code: any;
    name: string;
    address: string;
    keyPair: any;
    afterRun: any;
    autoAnswerIdOnCall: boolean;
    autoRandomNonce: boolean;
    constructor({ locklift, abi, base64, code, name, address, keyPair, autoAnswerIdOnCall, autoRandomNonce, afterRun, }: {
        locklift: any;
        abi: any;
        base64?: any;
        code?: any;
        name: any;
        address?: string;
        keyPair?: any;
        autoAnswerIdOnCall?: any;
        autoRandomNonce?: boolean;
        afterRun?: any;
    });
    setAddress(address: any): void;
    setKeyPair(keyPair: any): void;
    run({ method, params, keyPair, }: {
        method: any;
        params: any;
        keyPair?: any;
    }): Promise<import("@tonclient/core").ResultOfProcessMessage>;
    call({ method, params, keyPair }: {
        method: any;
        params: any;
        keyPair: any;
    }): Promise<unknown>;
    decodeMessages(messages: any, is_internal: any): Promise<any[]>;
    getSentMessages(messageType: any, internal: any): Promise<any[]>;
    getEvents(eventName: any): Promise<any[]>;
}
