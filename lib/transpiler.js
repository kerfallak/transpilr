#!/usr/bin/env node
const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');
const fileHelper = require('./fileHelper');

const process = (options, callback) => {
    const { sourceFiles, outputFile, minify, watch } = options;

    let plugins = [];
    if (watch) plugins.push(watchify);

    let browserifyObject = browserify({
        entries: sourceFiles,
        cache: {},
        packageCache: {},
        plugin: plugins
    });

    if (minify) browserifyObject.transform('uglifyify', { global: true });

    browserifyObject['options'] = options;
    browserifyObject['callback'] = callback;
    let boundtranspileAndBundle = transpileAndBundle.bind(browserifyObject);

    if (watch) browserifyObject.on('update', boundtranspileAndBundle);

    boundtranspileAndBundle();
}

function transpileAndBundle() {
    this.bundle().pipe(fs.createWriteStream(this.options.outputFile));
    if (this.callback) this.callback(this.options);
}

const createTranspilerEntries = (sourcesPaths, outputPath, minify, watch) => {
    let sourceFiles = getSourceFiles(sourcesPaths);
    fileHelper.makeDirectory(outputPath);

    let entries = [];

    if (fileHelper.isDirectory(outputPath)) {
        sourceFiles.forEach(sourcefileName => {
            let outputFile = fileHelper.createFullOutPutFileName(outputPath, sourcefileName);
            entries.push(createEntry([].concat(sourcefileName), outputFile, minify, watch));
        });
    }
    else {
        entries.push(createEntry(sourceFiles, outputPath, minify, watch));
    }

    return entries;
}

function createEntry(sourceFiles, outputFile, minify, watch) {
    return {
        sourceFiles,
        outputFile: (minify) ? fileHelper.createMinFileName(outputFile) : outputFile,
        minify,
        watch
    };
}

function getSourceFiles(sourcesPaths) {
    let sourceFiles = fileHelper.getMultipleDirectoryJsFiles(sourcesPaths);
    return fileHelper.filterOutTestFiles(sourceFiles);
}

module.exports = {
    process,
    createTranspilerEntries
}