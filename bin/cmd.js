#!/usr/bin/env node
const yargs = require('yargs');
const transpilr = require('../index');

const argv = yargs.command('$0 <source..>',
    'transpile, watch, bundle and minify new javascript versions (es6 and newer) to older version es5',
    {
        source: {
            alias: 's',
            describe: 'Source directory/file path. This parameter accept multiple values'
        },
        output: {
            alias: 'o',
            describe: 'output directory/file path',
            demandOption: true,
            type: 'string'
        },
        minify: {
            alias: 'm',
            describe: 'turn on/off minification',
            type: 'boolean',
            default: false

        },
        watch: {
            alias: 'w',
            describe: 'watch and auto-transpile on every source update',
            type: 'boolean',
            default: false
        },
        loud: {
            alias: 'l',
            describe: 'log successful activities to the console (verbose)',
            type: 'boolean',
            default: false
        },
        all: {
            alias: 'a',
            describe: 'include every javascript files, including test files',
            type: 'boolean',
            default: false
        }
    },
    commandHandler
)
.help("h")
.alias("h", "help")
.parse("", (err, argv, output) => {
    if (output) {
      const newOutput = output.replace("cmd.js <source..>", "transpilr <source..>");
      console.log(newOutput);
    }
  })
.argv;

function commandHandler(argv) {
    transpilr.transpile(adaptToTranspilerOptions(argv), (options) => {
        if (argv.loud)
            console.log(`${options.sourceFiles} -> ${options.outputFile}`);
    });
}

function adaptToTranspilerOptions(argv){
    return {
        sourcesPaths: argv.source,
        outputPath: argv.output,
        minify: argv.minify,
        watch: argv.watch,
        all: argv.all
    };
}
