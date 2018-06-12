const transpiler = require('../lib/transpiler');
const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');
const fileHelper = require('../lib/fileHelper');
const chai = require('chai');
const mock = require('mock-fs');
const sinon = require('sinon');
const shell = require('shelljs');
var expect = chai.expect;

describe('transpiler', () => {
    beforeEach(() => {
        mock({
            'fake/dir': {
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
            'fake/dir2': {
                'myJavascriptFile4.js': 'const greeting="hello world"',
                'myTestFile4.spec.js': 'const greeting="hello world"'
            }
        });
    });

    afterEach(() => {
        mock.restore();
    });

    describe('createTranspilerEntries', () => {

        describe('given source : [fake/dir, fake/dir2], output: dist, minify: false, all: false ', () => {
            let act = () => {
                let options = {
                    sourcesPaths: ['fake/dir', 'fake/dir2'],
                    outputPath: 'dist',
                    minify: false,
                    watch: false,
                    all: false
                }
                return transpiler.createTranspilerEntries(options);
            };
            it('should return 4 entries', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();
                expect(result.length).to.be.equal(4);
            });
            it('should return correct entries', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();

                let expectedEntries = [{
                    sourceFiles: ['fake\\dir\\myJavascriptFile.js'],
                    outputFile: 'dist\\myJavascriptFile.js',
                    minify: false,
                    watch: false
                },
                {
                    sourceFiles: ['fake\\dir\\myJavascriptFile2.js'],
                    outputFile: 'dist\\myJavascriptFile2.js',
                    minify: false,
                    watch: false
                },
                {
                    sourceFiles: ['fake\\dir2\\myJavascriptFile4.js'],
                    outputFile: 'dist\\myJavascriptFile4.js',
                    minify: false,
                    watch: false
                },
                {
                    sourceFiles: ['fake\\dir\\fakeSubDir\\myJavascriptFile3.js'],
                    outputFile: 'dist\\myJavascriptFile3.js',
                    minify: false,
                    watch: false
                }
                ];

                expect(result).to.deep.include.members(expectedEntries);
            });
        });

        describe('given source : [fake/dir, fake/dir2], output: output.js, minify: false, all: false ', () => {
            let act = () => {
                let options = {
                    sourcesPaths: ['fake/dir', 'fake/dir2'],
                    outputPath: 'output.js',
                    minify: false,
                    watch: false,
                    all: false
                }
                return transpiler.createTranspilerEntries(options);
            };
            it('should return 1 entry', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();
                expect(result.length).to.be.equal(1);
            });
            it('should return correct entry', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();

                let expectedEntries = [{
                    sourceFiles: ['fake\\dir\\fakeSubDir\\myJavascriptFile3.js', 'fake\\dir\\myJavascriptFile.js', 'fake\\dir\\myJavascriptFile2.js', 'fake\\dir2\\myJavascriptFile4.js'],
                    outputFile: 'output.js',
                    minify: false,
                    watch: false
                }
                ];

                expect(result).to.deep.include.members(expectedEntries);
            });
        });

        describe('given source : [fake/dir2], output: dist, minify: true, all: false ', () => {
            let act = () => {
                let options = {
                    sourcesPaths: ['fake/dir2'],
                    outputPath: 'dist',
                    minify: true,
                    watch: true,
                    all: false
                }
                return transpiler.createTranspilerEntries(options);
            };
            it('should return 1 entry', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();
                expect(result.length).to.be.equal(1);
            });
            it('should return correct entry with minify output fileName', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();

                let expectedEntries = [{
                    sourceFiles: ['fake\\dir2\\myJavascriptFile4.js'],
                    outputFile: 'dist\\myJavascriptFile4.min.js',
                    minify: true,
                    watch: true
                }
                ];

                expect(result).to.deep.include.members(expectedEntries);
            });
        });

        describe('given source : [fake/dir2], output: dist, minify: false, all: true ', () => {
            let act = () => {
                let options = {
                    sourcesPaths: ['fake/dir2'],
                    outputPath: 'dist',
                    minify: false,
                    watch: false,
                    all: true
                }
                return transpiler.createTranspilerEntries(options);
            };
            it('should return 2 entries', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();
                expect(result.length).to.be.equal(2);
            });
            it('should return correct entries including spec/test files', () => {
                let mkdirStubs = sinon.stub(shell, 'mkdir');
                let result = act();
                mkdirStubs.restore();

                let expectedEntries = [{
                    sourceFiles: ['fake\\dir2\\myJavascriptFile4.js'],
                    outputFile: 'dist\\myJavascriptFile4.js',
                    minify: false,
                    watch: false
                },
                {
                    sourceFiles: ['fake\\dir2\\myTestFile4.spec.js'],
                    outputFile: 'dist\\myTestFile4.spec.js',
                    minify: false,
                    watch: false
                }
                ];

                expect(result).to.deep.include.members(expectedEntries);
            });
        });
    });
});