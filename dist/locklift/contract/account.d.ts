import { Contract } from './index';
export declare class Account extends Contract {
    runTarget({ contract, method, params, value, keyPair }: {
        contract: any;
        method: any;
        params: any;
        value: any;
        keyPair: any;
    }): Promise<import("@tonclient/core").ResultOfProcessMessage>;
}
