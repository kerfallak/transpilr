#!/usr/bin/env node
const transpiler = require('./lib/transpiler');

const transpile = (options, callback) => {
  let entries = transpiler.createTranspilerEntries(options);
  entries.forEach(entry => transpiler.process(entry, callback));
}

module.exports = {
  transpile
};