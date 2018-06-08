#!/usr/bin/env node
const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');

exports.transpile = (sourceFiles, outputFile, minify, watch) =>
{ 
    let plugins = [];
    if(watch) plugins.push(watchify);

    let browserifyObject = browserify({
      entries: sourceFiles,
      cache: {},
      packageCache: {},
      plugin: plugins
    });

    if(minify) browserifyObject.transform('uglifyify', { global: true  });
     
    browserifyObject['outputPath'] = outputFile;
    let boundtranspileAndBundle = transpileAndBundle.bind(browserifyObject);
  
    if(watch) browserifyObject.on('update', boundtranspileAndBundle);
  
    boundtranspileAndBundle();
}
  
function transpileAndBundle() {
   this.bundle().pipe(fs.createWriteStream(this.outputPath));
}