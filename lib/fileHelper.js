const path = require('path'), fs=require('fs');
const shell = require('shelljs');


function findJSFiles(startPath){
    let files = [];

    if (!fs.existsSync(startPath)){
        console.log(`can't find directory ${startPath}`);
        return [];
    }

    let directoryFileList = fs.readdirSync(startPath);

    directoryFileList.forEach((file)=>{
        var filename=path.join(startPath,file);

        if (isDirectory(filename)){
            files = files.concat(findJSFiles(filename));
        }
        else if (/\.js$/.test(filename)) files.push(filename);
    });

    return files;
};

function isDirectory(filename){
    const {ext} = path.parse(filename);
    return !ext;
}

function filterOutTestFiles(files){
    return files.filter((filename)=>{
        return /^(?!.*\.test\.js$)(?!.*\.spec\.js$).*\.js$/.test(filename)
    })
}

function makeDirectory(directoryPath){
  const {dir} = path.parse(directoryPath);
  if(dir) shell.mkdir('-p', dir);
}

function createFullOutPutFileName(destinationDirectory, sourceFileName){
  let fileName = path.basename(sourceFileName);
  return path.join(destinationDirectory, fileName);
}


module.exports = {
    findJSFiles,
    isDirectory,
    filterOutTestFiles,
    makeDirectory,
    createFullOutPutFileName
};