import { Factory } from './factory';
import { Giver } from './giver';
import { Keys } from './keys';
import { Ton } from './ton';
export default class Locklift {
    static ton: Ton;
    static factory: Factory;
    static giver: Giver;
    static keys: Keys;
    static utils: any;
    networkConfig: any;
    config: any;
    network: any;
    constructor(config: any, network: any);
    setup(): Promise<void>;
}
