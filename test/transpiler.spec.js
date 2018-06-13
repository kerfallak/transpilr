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

    describe('createBrowserifyInstance', ()=>{
        it('should return empty plugin watch: false', ()=>{
            let options = {
                watch: false,
                sourceFiles: ['test1.js', 'demo/test2.js'],
                minify: false
            };
            let result = transpiler.createBrowserifyInstance(options);
           expect(result._options.plugin).to.be.empty;

        });

        it('should return correct sources given source array', ()=>{
            let options = {
                watch: false,
                sourceFiles: ['file.js'],
                minify: false
            };
            let result = transpiler.createBrowserifyInstance(options);
           expect(result._options.entries).to.be.eql(['file.js']);
        });
        it('should return plugin with array of 1 given watch: true', ()=>{
            let options = {
                watch: true,
                sourceFiles: ['file.js'],
                minify: false
            };
            let result = transpiler.createBrowserifyInstance(options);
           expect(result._options.plugin.length).to.be.equal(1);
        });
        it('should return result that includes callback as property', ()=>{
            let options = {
                watch: false,
                sourceFiles: ['file.js'],
                minify: false
            };
            let callback = ()=>{return 'me'};
            let result = transpiler.createBrowserifyInstance(options, callback);
           expect(result.callback).to.be.eql(callback);
        });
    });

    describe('setAndExecuteBundlingEvent', ()=>{
        it('should call transform given minify is true', ()=>{
            const browserifyObject = browserify({});
            const transformStub = sinon.stub(browserifyObject, 'transform');

            transpiler.setAndExecuteBundlingEvent({watch: false, minify: true, outputFile: 'test.js'}, browserifyObject);
            transformStub.restore();

            sinon.assert.calledWith(transformStub, 'uglifyify', { global: true });
        });
        it('should not call transform given minify is false', ()=>{
            const browserifyObject = browserify({});
            const transformStub = sinon.stub(browserifyObject, 'transform');

            transpiler.setAndExecuteBundlingEvent({watch: false, minify: false, outputFile: 'test.js'}, browserifyObject);
            transformStub.restore();

            sinon.assert.notCalled(transformStub);
        });
        it('should set up on update even given watch is true', ()=>{
            const browserifyObject = browserify({});
            const onStub = sinon.stub(browserifyObject, 'on');

            transpiler.setAndExecuteBundlingEvent({watch: true, minify: false, outputFile: 'test.js'}, browserifyObject);
            onStub.restore();

            sinon.assert.calledOnce(onStub);
        });
        it('should not set up on update even given watch is false', ()=>{
            const browserifyObject = browserify({});
            const onStub = sinon.stub(browserifyObject, 'on');

            transpiler.setAndExecuteBundlingEvent({watch: false, minify: false, outputFile: 'test.js'}, browserifyObject);
            onStub.restore();

            sinon.assert.notCalled(onStub);
        });
        it('should call the callback given that browserifyObject has one', ()=>{
            const browserifyObject = browserify({});
            let callback = sinon.spy();
            browserifyObject['callback'] = callback;

            transpiler.setAndExecuteBundlingEvent({watch: false, minify: false, outputFile: 'test.js'}, browserifyObject);

            sinon.assert.calledOnce(callback);
        });
    });

    describe('createBrowserifyOptions', ()=>{
        it('should include watchify given watch: true', ()=>{
            let result = transpiler.createBrowserifyOptions({
                watch: true,
                sourceFiles: ['test1.js', 'demo/test2.js'],

            });

            expect(result).to.be.eql({
                entries: ['test1.js', 'demo/test2.js'],
                cache: {},
                packageCache: {},
                plugin: [].concat(watchify)
            });
        });

        it('should not include watchify given watch: false', ()=>{
            let result = transpiler.createBrowserifyOptions({
                watch: false,
                sourceFiles: ['test1.js', 'demo/test2.js'],

            });

            expect(result).to.be.eql({
                entries: ['test1.js', 'demo/test2.js'],
                cache: {},
                packageCache: {},
                plugin: []
            });
        });
    });
});