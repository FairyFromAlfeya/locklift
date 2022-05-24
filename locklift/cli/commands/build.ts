import { Command } from 'commander';
import { loadConfig } from '../../config';
import { initializeDirIfNotExist, Builder } from '../utils';

export const program = new Command()
  .name('build')
  .description('Build contracts by using TON Solidity compiler and TVM linker')
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
    '--config <config>',
    'Path to the config file',
    async (config) => loadConfig(config),
  )
  .action(async (options) => {
    const config = await options.config;

    initializeDirIfNotExist(options.build);

    const builder = new Builder(config, options);

    const status = builder.buildContracts();

    if (status === false) process.exit(1);

    process.exit(0);
  });
