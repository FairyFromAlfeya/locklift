import { Contract } from '../contract';
import Locklift from '../index';
export declare class Giver {
    locklift: Locklift;
    giver: Contract;
    constructor(locklift: any);
    deployContract({ contract, constructorParams, initParams, keyPair }: {
        contract: any;
        constructorParams: any;
        initParams: any;
        keyPair: any;
    }, amount?: any): Promise<any>;
    setup(): Promise<void>;
}
