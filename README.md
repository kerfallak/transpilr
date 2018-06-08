# Transpilr

Live transpile latest versions of Javascript (es2015 and newer) to older version (es5) for older browser support. Transpilr allows you to watch source files/directory, transpile, bundle and minify the output to your specified directory.

## Getting Started

These instructions will guide you through installing and running transpilr on your local machine for development and testing purposes. See npm package  [documentation](http://www.dropwizard.io/1.0.2/docs/) for instruction on how to use it in your project.

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

transpilr is simple to use and you will only ever need to call one function.

``` javascript
const transpilr = require('transpilr');

transpilr.transpile(sourcePaths, outputPath, minify, watch);

```

 Parameter description

* **sourcePaths**: string[] to provide source directory/file path(s). Accpets multiple values in array of string
* **outputPath**: string value to provide output directory/file path
* **Minify**: boolean value to indicate that the output should be minify
* **Watch**: boolean value to indicate that the output should be updated on every single change and save of the source files

## Authors

* **Kerfalla Kourouma** - *Initial work* - [kerfallak](https://github.com/kerfallak)

See also the list of [contributors](https://github.com/kerfallak/transpilr/graphs/contributors) who participated in this project.
