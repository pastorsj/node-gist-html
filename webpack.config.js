/* global __dirname, require, module */

const path = require('path');
const env = require('yargs').argv.env; // eslint-disable-line

const libraryName = 'node-gist-html';

let outputFile;

if (env === 'build') {
    outputFile = `${libraryName}.min.js`;
} else {
    outputFile = `${libraryName}.js`;
}

const config = {
    entry: path.join(__dirname, 'src', 'index.js'),
    devtool: 'source-map',
    target: 'node',
    node: {
        __dirname: true
    },
    output: {
        path: path.join(__dirname, 'lib'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'node_modules')
        ],
        extensions: [
            '.js', '.json'
        ]
    },
    externals: {
        request: 'request',
        cheerio: 'cheerio',
        'html-minifier': 'html-minifier',
        'is-url': 'is-url'
    }
};

module.exports = config;
