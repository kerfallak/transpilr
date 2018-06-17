# Transpilr

Live transpile latest versions of Javascript (es2015 and newer) to older version (es5) for older browser support. Transpilr allows you to watch source files/directory, transpile, bundle and minify the output to your specified directory/file.

## Getting Started

These instructions will guide you through installing and including transpilr in your project.

### Prerequisites

You need node and npm installed on your machine

### Installation

transpilr is available on npm and is installed by running the following command in your terminal

``` bash
npm install transpilr --save-dev
```

note that transpilr can also be installed globally

```
npm install transpilr -g
```

### Usage

transpilr is simple to use and doesn't required any configuration. You will only ever need to call one function.

#### Code:

``` javascript
const transpilr = require('transpilr');

//transpiler configurations
let options = {
    sourcesPaths: ['inputFile.js'],
    outputPath: 'inputFile.js',
    minify: false,
    watch: false,
    all: true
}

//callback function invoked everytime a file has been transpiled successfully
const callback = (options) => {
    console.log(`${options.sourceFiles} -> ${options.outputFile}`);
}

//call this to transpile
transpilr.transpile(options, callback);

```

 Parameter descriptions

* **Options:** ~ *required*
    * **sourcePaths**: ~ *required* ~ provide source directory/file path(s). Accpets multiple values in array of string
    * **outputPath**: ~ *required* ~ string value to provide output directory/file path
    * **Minify**: ~ *optional* ~ boolean value to indicate that the output should be minify
    * **Watch**: ~ *optional* ~ boolean value to indicate that the output should be updated on every single change and save of the source files
    * **all**: ~ *optional* ~  boolean value to indicate that all javascript files including spec/test files should be transpiled
* **Callback:** ~ *optional* ~ is called on completion of the process. 

#### Command Line:
the command keyword is **transpilr** and requires at mininum a source file/directory path and an output file/directory path
``` bash
transpilr <sources..> -o <output> [-w] [-m] [-a] [-l]
```
Command Parameters:

* sources : ~*required*~ should be listed right after the command keyword **transpilr** . It takes single or multiple file/direcotry path(s) separated with a space
* output : ~*required*~ takes the output file/directory path. note that this value has to always be preceded by the flag **-o**
* -w : ~*optional*~ flag to watch source and update output on change.
* -m : ~*optional*~ flag to minify output
* -a : ~*optional*~ flag to transpile all javascript file in source file/directory. by default spec/test files are ignored
* -l : ~*optional*~ flag to turn on loud process that outputs results on the terminal.

examples:

``` bash
transpilr inputFile.js -o outputfile.js
```
the above example transpile inputFile.js to outputfile.js. and for multiple sources, you can do the following

``` bash
transpilr inputFile1.js inputFile2.js inputDirectory1 -o outputdirectory
```
note that when you provide multiple sources and provide a file path as output, the result is bundled as shown below

``` bash
transpilr inputFile1.js inputFile2.js inputDirectory1 -o bundledOutput.js
```
you can add any or combinaison of optional flags to affect the command behavior.

``` bash
transpilr inputFile1.js -o outputFile.js -m -w -l -a
```


Other Useful Paramaters:
* -h : shows help
``` bash
transpilr -h
```
* --version: shows version number
``` bash
transpilr --version
```

## Authors

* **Kerfalla Kourouma** - *Initial work* - [kerfallak](https://github.com/kerfallak)

See also the list of [contributors](https://github.com/kerfallak/transpilr/graphs/contributors) who participated in this project.
