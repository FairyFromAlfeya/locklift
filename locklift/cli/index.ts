import { program } from 'commander';
import { program as initProgram } from './commands/init';
import { program as buildProgram } from './commands/build';
import { program as testProgram } from './commands/test';
import { program as runProgram } from './commands/run';
import { program as gendocProgram } from './commands/gendoc';

import packageJson from './../../package.json';

program.addCommand(initProgram);
program.addCommand(buildProgram);
program.addCommand(testProgram);
program.addCommand(runProgram);
program.addCommand(gendocProgram);

program.version(packageJson.version);

program.parse(process.argv);
