#!/usr/bin/env node
const yargs = require('yargs');
const transpilr = require('../index');

const argv = yargs.command('$0 <source..>',
 'Observe file/directory and transpile on save', 
{
    source:{
        alias:'s',
        describe: 'Source directory/file path. This parameter accept multiple values'
    },
    output:{
        alias:'o',
        describe:'output directory/file path',
        demandOption: true,
        type: 'string'
    },
    minify:{
        alias: 'm',
        describe: 'turn on/off minification',
        type: 'boolean',
        default: false

    },
    watch:{
        alias: 'w',
        describe: 'watch and auto-transpile on every source update',
        type:'boolean',
        default: false
    }
},
function(argv){
    transpilr.transpile(argv.source, argv.output, argv.minify, argv.watch);
}
)
.help("h")
.alias("h", "help")
.argv;
