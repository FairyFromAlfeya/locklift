import path from 'path';
import { loadBase64FromFile, loadJSONFromFile } from '../utils';
import { Contract } from '../contract';
import { Account } from '../contract/account';
import Locklift from '../index';

/**
 * Factory object for generating initializing Contract objects.
 */
export class Factory {
  locklift: Locklift;

  constructor(locklift) {
    this.locklift = locklift;
  }

  /**
   * Initialize Contract object by its name and build path.
   * Loads Base64 TVC encoded, ABI, derive code from base64 TVC.
   * @param name
   * @param resolvedPath
   * @returns {Promise<Contract>}
   */
  async initializeContract(name, resolvedPath) {
    const base64 = loadBase64FromFile(`${resolvedPath}/${name}.base64`);
    const abi = loadJSONFromFile(`${resolvedPath}/${name}.abi.json`);

    const { code } = await Locklift.ton.client.boc.get_code_from_tvc({
      tvc: base64,
    });

    return new Contract({
      locklift: this.locklift,
      abi,
      base64,
      code,
      name,
    });
  }

  /**
   * Get contract instance
   * @param name Contract file name
   * @param [build='build'] Build path
   * @returns {Promise<Contract>}
   */
  async getContract(name, build = 'build') {
    const resolvedBuildPath = path.resolve(process.cwd(), build);

    return this.initializeContract(name, resolvedBuildPath);
  }

  async getAccount(name = 'Account', build = 'build') {
    const resolvedBuildPath = path.resolve(process.cwd(), build);

    const contract = await this.initializeContract(name, resolvedBuildPath);

    return new Account({
      locklift: this.locklift,
      abi: contract.abi,
      base64: contract.base64,
      code: contract.code,
      name: contract.name,
    });
  }
}
