#!/usr/bin/env node
const yargs = require('yargs');
const transpilr = require('../index');

const argv = yargs.command('$0 <source..>',
    'transpile, watch, bundle and minify new javascript versions (es6 and newer) to older version es5',    
        (yargs) => yargs.positional('source', {
            describe: 'Source directory/file paths. Accepts multiple values separated with space'
        })
        .option('output', {
            alias: 'o',
            describe: 'output directory/file path. precede value with the flag -o',
            demandOption: true,
            type: 'string'
        })
        .option('minify', {
            alias: 'm',
            describe: 'turn on/off minification',
            type: 'boolean',
            default: false

        })
        .option('watch', {
            alias: 'w',
            describe: 'watch and auto-transpile on every source update',
            type: 'boolean',
            default: false
        })
        .option('loud', {
            alias: 'l',
            describe: 'log successful activities to the console (verbose)',
            type: 'boolean',
            default: false
        })
        .option('all', {
            alias: 'a',
            describe: 'include every javascript files, including test files',
            type: 'boolean',
            default: false
        }
    ),
    commandHandler
)
.help("h")
.alias("h", "help")
.alias("v", "version")
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
