#!/usr/bin/env node
const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');
const fileHelper = require('./fileHelper');

const process = (options, callback) => { 
    let browserifyObject = createBrowserifyInstance(options, callback);
    setAndExecuteBundlingEvent(options, browserifyObject);
}

function createBrowserifyInstance(options, callback){
    let browserifyObject = browserify(createBrowserifyOptions(options));       
    browserifyObject['callback'] = callback;
    return browserifyObject;
}

function createBrowserifyOptions(options){
    return {
         entries: options.sourceFiles,
         cache: {},
         packageCache: {},
         plugin: (options.watch)? [].concat(watchify) : []
     };
 }

function setAndExecuteBundlingEvent(options, browserifyObject){
    browserifyObject.transform("babelify", {presets: ["env"]});

    if (options.minify) browserifyObject.transform('uglifyify', { global: true });
    
    browserifyObject['options'] = options;
    let boundtranspileAndBundle = transpileAndBundle.bind(browserifyObject);
    if (options.watch) browserifyObject.on('update', boundtranspileAndBundle);

    boundtranspileAndBundle();
}

function transpileAndBundle() {
    this.bundle().pipe(fs.createWriteStream(this.options.outputFile));
    if (this.callback) this.callback(this.options);
}


const createTranspilerEntries = (options) => {
    const { sourcesPaths, outputPath, minify, watch, all } = options;
    let sourceFiles = getSourceFiles(sourcesPaths, all);
    if(sourceFiles.length == 0) return [];

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

function getSourceFiles(sourcesPaths, all) {
    let sourceFiles = fileHelper.getMultipleDirectoryJsFiles(sourcesPaths);
    return (all)? sourceFiles : fileHelper.filterOutTestFiles(sourceFiles);
}

module.exports = {
    process,
    createTranspilerEntries,
    createBrowserifyInstance,
    setAndExecuteBundlingEvent,
    transpileAndBundle,
    createBrowserifyOptions
}