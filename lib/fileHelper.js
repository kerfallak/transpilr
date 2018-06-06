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

function makeDirectory(directory){
  const {ext, dir} = path.parse(directory);

  if(ext)
    shell.mkdir('-p', dir);
  else
     shell.mkdir('-p', directory);
}

function createDestinationFullFileName(destinationDirectory, sourceFileName){
  let fileName = path.basename(sourceFileName);
  return path.join(destinationDirectory, fileName);
}

function createBundleFile(directory){
    return path.join(directory, 'bundle.js');
}


module.exports = {
    findJSFiles,
    isDirectory,
    filterOutTestFiles,
    makeDirectory,
    createDestinationFullFileName,
    createBundleFile
};