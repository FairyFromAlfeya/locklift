import Locklift from '../index';
export declare class Keys {
    locklift: Locklift;
    keyPairs: any[];
    constructor(locklift: any);
    getKeyPairs(): Promise<any[]>;
    setup(): Promise<void>;
}
