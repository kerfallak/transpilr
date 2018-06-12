const fs = require('fs');
const transpiler = require('../lib/transpiler');
const fileHelper = require('../lib/fileHelper');
const sinon = require('sinon');
const mock = require('mock-fs');
const index = require('../index');
const chai = require('chai');
const expect = chai.expect;

describe('index.js', () => {
    beforeEach(() => {
        mock({
            'path/to/fake/dir': {
                'some-file.txt': 'file content here',
                'myJavascriptFile.js': 'const greeting="hello world"',
                'myTestFile.spec.js': 'const greeting="hello world"',
                'myJavascriptFile2.js': 'const greeting="hello world"',
                'some-file2.txt': 'file content here',
                'fakeSubDir': {
                    'myJavascriptFile3.js': 'const greeting="hello world"',
                    'myTestFile.test.js': 'const greeting="hello world"',
                }
            },
            'path/to/fake/dir2': {
                'myJavascriptFile4.js': 'const greeting="hello world"',
                'myTestFile4.spec.js': 'const greeting="hello world"'
            }
        });
    });

    afterEach(() => {
        mock.restore();
    });

    describe('transpile', () => {
        it('should call transpiler.process once with correct parameters and callback once', () => {
            const transpileStub = sinon.stub(transpiler, 'process');
            transpileStub.yields();

            const expectedEntry = {
                sourceFiles: ['path\\to\\fake\\dir2\\myJavascriptFile4.js'],
                outputFile: 'dist\\myJavascriptFile4.js',
                minify: false,
                watch: false
            };

            const createTranspilerEntriesStub = sinon.stub(transpiler, "createTranspilerEntries").callsFake(function (a) {
                return [expectedEntry];
            });

            var callback = sinon.spy();
            index.transpile({}, callback);

            transpileStub.restore();
            createTranspilerEntriesStub.restore();

            sinon.assert.calledOnce(callback);
            sinon.assert.calledWith(transpileStub, expectedEntry, callback);
        });

        it('should call transpiler.process twice with correct parameters and callback twice', () => {
            const transpileStub = sinon.stub(transpiler, 'process');
            transpileStub.yields();

            const expectedEntry1 = {
                sourceFiles: ['path\\to\\fake\\dir2\\myJavascriptFile4.js'],
                outputFile: 'dist\\myJavascriptFile4.js',
                minify: false,
                watch: false
            };
            const expectedEntry2 = {
                sourceFiles: ['path\\to\\fake\\dir2\\myJavascriptFile2.js'],
                outputFile: 'dist\\myJavascriptFile2.js',
                minify: false,
                watch: false
            };

            const createTranspilerEntriesStub = sinon.stub(transpiler, "createTranspilerEntries").callsFake(function (a) {
                return [expectedEntry1, expectedEntry2];
            });

            var callback = sinon.spy();
            index.transpile({}, callback);

            transpileStub.restore();
            createTranspilerEntriesStub.restore();

            sinon.assert.calledTwice(callback);
            sinon.assert.calledWith(transpileStub, expectedEntry1, callback);
            sinon.assert.calledWith(transpileStub, expectedEntry2, callback);
        });
    });
});