#!/usr/bin/env node
const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');

exports.transpile = (sourceFiles, distFile, minify, live) =>
{ 
    let plugins = [];

    if(live)
        plugins.push(watchify);

    let browserifyObject = browserify({
      entries: sourceFiles,
      cache: {},
      packageCache: {},
      plugin: plugins
    });

    if(minify)
        browserifyObject.transform('uglifyify', { global: true  });
     
    browserifyObject['distFile'] = distFile;
    let boundtranspileAndBundle = transpileAndBundle.bind(browserifyObject);
  
    if(live)
        browserifyObject.on('update', boundtranspileAndBundle);
  
    boundtranspileAndBundle();
}
  
function transpileAndBundle() {
   this.bundle().pipe(fs.createWriteStream(this.distFile));
}