#!/usr/bin/env node
const yargs = require('yargs');
const transpile5 = require('../index');

const argv = yargs.command('$0 <source> <destination>',
 'Observe file/directory and transpile on save', 
{
    source:{
        alias:'s',
        describe: 'Source directory/file'
    },
    destination:{
        alias:'d',
        describe:'Destination directory/file'
    },
    bundle:{
        alias: 'b',
        describe: 'turn on/off bundling',
        type: 'boolean',
        default: false

    },
    minify:{
        alias: 'm',
        describe: 'turn on/off minification',
        type: 'boolean',
        default: false

    },
    watch:{
        alias: 'w',
        describe: 'watch and auto-transpilation on every source update',
        type:'boolean',
        default: false
    }
},
function(argv){
    transpile5.watch(argv.source, argv.destination, argv.bundle, argv.minify, argv.watch);
}
)
.help("h")
.alias("h", "help")
.argv;