#!/usr/bin/env node
const fs = require('fs');
const transpiler = require('./lib/transpiler');
const fileHelper = require('./lib/fileHelper');

const transpile = (sourcesPaths, outputPath, minify, watch) => {
  let entries = transpiler.createTranspilerEntries(sourcesPaths, outputPath, minify, watch);
  entries.forEach(entry => transpiler.process(entry, logProcessedEntry));
}

const logProcessedEntry = (options) => {
  console.log(`${options.sourceFiles} -> ${options.outputFile}`);
};

module.exports = {
  transpile
};