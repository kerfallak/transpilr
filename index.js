#!/usr/bin/env node
const fs = require('fs');
const transpiler = require('./lib/transpiler');
const fileHelper = require('./lib/fileHelper');
 
const transpile = (sourcePath, outputPath, minify, watch) =>
{
  if (!fs.existsSync(sourcePath)){
    console.log(`can't find source directory/file : ${sourcePath}`);
    return;
  } 

  fileHelper.makeDirectory(outputPath);

  let sourceFiles = [];
  let sourceIsDir = fileHelper.isDirectory(sourcePath);
  let destinationIsDir = fileHelper.isDirectory(outputPath);


  if(sourceIsDir){
    sourceFiles = sourceFiles.concat(fileHelper.findJSFiles(sourcePath));
    sourceFiles = fileHelper.filterOutTestFiles(sourceFiles);
    if(destinationIsDir){
      sourceFiles.forEach(file => {
        let distFile = fileHelper.createDestinationFullFileName(outputPath, file);
        transpiler.transpile([].concat(file), distFile, minify, live);
      });
    }
    else{
      transpiler.transpile(sourceFiles, outputPath, minify, live);
    }
  }
  else{
    let distFile = outputPath;
      if(destinationIsDir)
        distFile = fileHelper.createDestinationFullFileName(outputPath, sourcePath);
    transpiler.transpile([].concat(sourcePath), distFile, minify, live);
  }
}

module.exports = {
  transpile
};