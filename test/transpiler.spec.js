const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');
const fileHelper = require('../lib/fileHelper');
const expect = require('expect');
const mock = require('mock-fs');
const sinon = require('sinon');

describe('transpiler', ()=>{
    beforeEach(()=>{
        mock({
            'path/to/fake/dir': {
              'some-file.txt': 'file content here',
              'myJavascriptFile.js': 'const greeting="hello world"',
              'myTestFile.spec.js': 'const greeting="hello world"',
              'myJavascriptFile2.js': 'const greeting="hello world"',
              'some-file2.txt': 'file content here',
              'fakeSubDir':{
                'myJavascriptFile3.js': 'const greeting="hello world"',
                'myTestFile.test.js': 'const greeting="hello world"',
              }
            },
            'path/to/fake/dir2':{
                'myJavascriptFile4.js': 'const greeting="hello world"',
                'myTestFile4.spec.js': 'const greeting="hello world"'
            }
          });
    });

    afterEach(()=>{
        mock.restore();
    });

    describe('createTranspilerEntries', ()=>{
        
    });
});