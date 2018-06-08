#!/usr/bin/env node
const fs = require('fs');
const transpiler = require('./lib/transpiler');
const fileHelper = require('./lib/fileHelper');
 
const transpile = (sourcesPaths, outputPath, minify, watch) =>
{
   let sourceFiles = getSourceFiles(sourcesPaths);

   fileHelper.makeDirectory(outputPath);

   if(fileHelper.isDirectory(outputPath)){
     sourceFiles.forEach(sourcefileName => {
       let outputFile = fileHelper.createFullOutPutFileName(outputPath, sourcefileName);
       transpiler.transpile([].concat(sourcefileName), outputFile, minify, watch);
     });
   }
   else{
     transpiler.transpile(sourceFiles, outputPath, minify, watch);
   }
}

function getSourceFiles(sourcesPaths){
  let sourceFiles = [];

  sourcesPaths.forEach(sourcePath=>{
   if (!fs.existsSync(sourcePath)){
     console.log(`can't find source directory/file : ${sourcePath}`);
     return;
   } 
    if(fileHelper.isDirectory(sourcePath))
     sourceFiles = sourceFiles.concat(fileHelper.findJSFiles(sourcePath));
    else
     sourceFiles = sourceFiles.concat(sourcePath);
  });

  return fileHelper.filterOutTestFiles(sourceFiles);
}

module.exports = {
  transpile
};