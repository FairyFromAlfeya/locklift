import { Contract } from '../contract';
import { Account } from '../contract/account';
import Locklift from '../index';
export declare class Factory {
    locklift: Locklift;
    constructor(locklift: any);
    initializeContract(name: any, resolvedPath: any): Promise<Contract>;
    getContract(name: any, build?: string): Promise<Contract>;
    getAccount(name?: string, build?: string): Promise<Account>;
}
