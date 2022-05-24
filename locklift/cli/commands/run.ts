import vm from 'vm';
import fs from 'fs';
import { Command } from 'commander';
import { loadConfig } from '../../config';
import { initializeDirIfNotExist, Builder } from '../utils';
import Locklift from './../../index';

export const program = new Command()
  .name('run')
  .description('Run arbitrary locklift script')
  .option('--disable-build', 'Disable automatic contracts build', false)
  .option(
    '-c, --contracts <contracts>',
    'Path to the contracts folder',
    'contracts',
  )
  .option('-b, --build <build>', 'Path to the build folder', 'build')
  .option(
    '--disable-include-path',
    'Disables including node_modules. Use this with old compiler versions',
    false,
  )
  .requiredOption(
    '-n, --network <network>',
    'Network to use, choose from configuration',
  )
  .requiredOption(
    '--config <config>',
    'Path to the config file',
    async (config) => loadConfig(config),
  )
  .requiredOption('-s, --script <script>', 'Script to run')
  .allowUnknownOption()
  .action(async (options) => {
    const config = await options.config;

    if (config.networks[options.network] === undefined) {
      console.error(`Can't find configuration for ${options.network} network!`);

      process.exit(1);
    }

    if (options.disableBuild !== true) {
      initializeDirIfNotExist(options.build);

      const builder = new Builder(config, options);

      const status = builder.buildContracts();

      if (status === false) process.exit(1);
    }

    // Initialize Locklift
    const locklift = new Locklift(config, options.network);

    await locklift.setup();

    global.locklift = locklift;
    global.__dirname = __dirname;

    const scriptCode = fs.readFileSync(options.script);
    const script = new vm.Script(scriptCode.toString());
    script.runInThisContext();
  });
