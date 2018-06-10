const fs = require('fs');
const transpiler = require('../lib/transpiler');
const fileHelper = require('../lib/fileHelper');
const sinon = require('sinon');
const mock = require('mock-fs');
const index = require('../index');

describe('index.js',()=>{
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

    // describe('transpile', ()=>{
    //     it('should call transpiler.process', ()=>{
    //         const transpileStub = sinon.stub(transpiler, 'process');
           
    //         index.transpile(['path/to/fake/dir2'], 'dist', false, false);
    //         transpileStub.restore();
    //         sinon.assert.calledWith(transpileStub, ['path\\to\\fake\\dir2\\myJavascriptFile4.js'], 'dist\\myJavascriptFile4.js', false, false);
    //     });
    // });
});