import { Factory } from './factory';
import { Giver } from './giver';
import { Keys } from './keys';
import { Ton } from './ton';
import * as utils from './utils';

export default class Locklift {
  static ton: Ton;
  static factory: Factory;
  static giver: Giver;
  static keys: Keys;
  static utils: any;
  networkConfig: any;
  config: any;
  network: any;

  constructor(config, network) {
    this.config = config;
    this.network = network;

    this.networkConfig = this.config.networks[this.network];
  }

  async setup() {
    Locklift.ton = new Ton(this);
    Locklift.factory = new Factory(this);
    Locklift.giver = new Giver(this);
    Locklift.keys = new Keys(this);
    Locklift.utils = utils;

    await Locklift.giver.setup();
    await Locklift.keys.setup();
  }
}
