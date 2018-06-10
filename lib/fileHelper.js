const path = require('path'), fs = require('fs');
const shell = require('shelljs');


function findJSFiles(startPath) {
    let files = [];

    if (!fs.existsSync(startPath)) {
        console.log(`can't find directory ${startPath}`);
        return [];
    }

    let directoryFileList = fs.readdirSync(startPath);

    directoryFileList.forEach((file) => {
        var filename = path.join(startPath, file);

        if (isDirectory(filename)) {
            files = files.concat(findJSFiles(filename));
        }
        else if (/\.js$/.test(filename)) files.push(filename);
    });

    return files;
};

function isDirectory(filename) {
    const { ext } = path.parse(filename);
    return !ext;
}

function filterOutTestFiles(files) {
    return files.filter((filename) => {
        return /^(?!.*\.test\.js$)(?!.*\.spec\.js$).*\.js$/.test(filename)
    })
}

function createMinFileName(fileName) {
    return /\.min\.js$/.test(fileName) ? fileName : `${fileName.slice(0, -3)}.min.js`;
}

function makeDirectory(directoryPath) {

    const { dir, ext } = path.parse(directoryPath);

    if (!ext)
        shell.mkdir('-p', directoryPath);
    if (dir && dir !== '/')
        shell.mkdir('-p', dir);
}

function createFullOutPutFileName(destinationDirectory, sourceFileName) {
    let fileName = path.basename(sourceFileName);
    return path.join(destinationDirectory, fileName);
}

function getMultipleDirectoryJsFiles(multiplePaths) {
    let files = [];

    multiplePaths.forEach(path => {
        if (!fs.existsSync(path)) {
            console.log(`can't find directory/file : ${path}`);
            return;
        }
        if (isDirectory(path))
            files = files.concat(findJSFiles(path));
        else
            files = files.concat(path);
    });

    return files;
}


module.exports = {
    findJSFiles,
    isDirectory,
    filterOutTestFiles,
    makeDirectory,
    createFullOutPutFileName,
    getMultipleDirectoryJsFiles,
    createMinFileName
};