#!/usr/bin/env node
const fs = require('fs');
const transpiler = require('./lib/transpiler');
const fileHelper = require('./lib/fileHelper');
 
var entries = [];

const watch = (sourcePath, distPath, bundle, minify, live) =>
{
  if (!fs.existsSync(sourcePath)){
    console.log(`can't find source directory/file : ${sourcePath}`);
    return;
  } 

  fileHelper.makeDirectory(distPath);

  let sourceFiles = [];
  let sourceIsDir = fileHelper.isDirectory(sourcePath);
  let destinationIsDir = fileHelper.isDirectory(distPath);


  if(sourceIsDir){
    sourceFiles = sourceFiles.concat(fileHelper.findJSFiles(sourcePath));
    sourceFiles = fileHelper.filterOutTestFiles(sourceFiles);
    if(destinationIsDir){
      sourceFiles.forEach(file => {
        let distFile = fileHelper.createDestinationFullFileName(distPath, file);
        transpiler.transpile([].concat(file), distFile, minify, live);
      });
    }
    else{
      transpiler.transpile(sourceFiles, distPath, minify, live);
    }
  }
  else{
    let distFile = distPath;
      if(destinationIsDir)
        distFile = fileHelper.createDestinationFullFileName(distPath, sourcePath);
    transpiler.transpile([].concat(sourcePath), distFile, minify, live);
  }
}

module.exports = {
  watch
};