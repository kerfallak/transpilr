const fileHelper = require('../lib/fileHelper');
const expect = require('expect');
const mock = require('mock-fs');
const fs = require('fs');
const shell = require('shelljs');
const sinon = require('sinon');

describe('fileHelper', ()=>{

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
    })

    describe('findJSFiles', ()=>{
        let act = (directory) =>{
            return fileHelper.findJSFiles(directory || 'path/to/fake/dir');
        };

        it('should return array of 5 files', ()=>{
            expect(act().length).toBe(5);
        });

        it('should return array that contains myJavascriptFile2.js', ()=>{
            expect(act()).toContain('path\\to\\fake\\dir\\myJavascriptFile2.js');
        });

        it('should return array that does not contains some-file.txt', ()=>{
            expect(act()).not.toContain('path\\to\\fake\\dir\\some-file.txt');
        });

        it('should return array that contains myTestFile.test.js from sub direcotry', ()=>{
            expect(act()).toContain('path\\to\\fake\\dir\\fakeSubDir\\myTestFile.test.js');
        });

        it('should return empty array given non existing directory', ()=>{
            expect(act('path/to/fake/NonExistantDir').length).toBe(0);
        });
    });

    describe('isDirectory',()=>{
        it('should return true given path/to/fake/dir', ()=>{
            let isDirectory = fileHelper.isDirectory('path/to/fake/dir');
            expect(isDirectory).toBeTruthy();
        });
        it('should return false given path/to/fake/dir/myJavascriptFile.js', ()=>{
            let isDirectory = fileHelper.isDirectory('path/to/fake/dir/myJavascriptFile.js');
            expect(isDirectory).toBeFalsy();
        });
    });

    describe(`filterOutTestFiles given ${['file1.js', 'files2.spec.js', 'dir/file2.js', 'dir/files2.test.js']}`, ()=>{
        let act = (fileArray)=>{
            fileArray = fileArray || ['file1.js', 'files2.spec.js', 'dir/file2.js', 'dir/files2.test.js'];
            return fileHelper.filterOutTestFiles(fileArray);
        };

        it('should return array of 2', ()=>{
            expect(act().length).toBe(2);
        });
        it('should return array that contains file1.js', ()=>{
            expect(act()).toContain('file1.js');
        });
        it('should return array that contains dir/file2.js', ()=>{
            expect(act()).toContain('dir/file2.js');
        });
        it('should return array that does not contains files2.spec.js', ()=>{
            expect(act()).not.toContain('files2.spec.js');
        });
        it('should return array that does not contains dir/files2.test.js', ()=>{
            expect(act()).not.toContain('dir/files2.test.js');
        });
    });

    describe('makeDirectory', ()=>{
        [
            { input: 'testDir/file.js', expectedResult: 'testDir'},
            { input: 'testDir/testAgain/file.js', expectedResult: 'testDir/testAgain'},
            { input: 'testDir', expectedResult: 'testDir'},
            { input: '/testDir/testAgain', expectedResult: '/testDir/testAgain'}
        ].forEach(testCase =>{
            it(`should call mkdir with argument ${testCase.expectedResult} given ${testCase.input}`, ()=>{
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                fileHelper.makeDirectory(testCase.input);
                mkdirStubs.restore();
                sinon.assert.calledWith(mkdirStubs, '-p', testCase.expectedResult);
            });
        });

        ['test.js', '/test.js'].forEach(testCase=>{
            it(`should not call mkdir given ${testCase}`, ()=>{
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                fileHelper.makeDirectory(testCase);
                mkdirStubs.restore();
                sinon.assert.notCalled(mkdirStubs);
            });
        });
    });

    describe('createFullOutPutFileName', ()=>{
        it('should return dist/file.js given dist and dir/files.js', ()=>{
            let result = fileHelper.createFullOutPutFileName('dist', 'dir/files.js');
            expect(result).toBe('dist\\files.js');
        });
    });

    describe('getMultipleDirectoryJsFiles', ()=>{
        let act = () =>{
            return fileHelper.getMultipleDirectoryJsFiles(['path/to/fake/dir','path/to/fake/dir2']);
        };

        it('should return an array of 7 files given 2 directory', ()=>{
            expect(act().length).toBe(7);
        });
        it('should return an array that contains path/to/fake/dir/myJavascriptFile.js ', ()=>{
            expect(act()).toContain('path\\to\\fake\\dir\\myJavascriptFile.js');
        });
        it('should return an array that contains path/to/fake/dir2/myJavascriptFile4.js ', ()=>{
            expect(act()).toContain('path\\to\\fake\\dir2\\myJavascriptFile4.js');
        });
    });
});