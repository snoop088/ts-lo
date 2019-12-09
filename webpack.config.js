// webpack.config.js
const path = require('path');
module.exports = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        publicPath: '/dist/',
        index: 'index.html',

    },
    externals: {
        'TweenLite': {
            commonjs: "TweenLite",
            amd: "TweenLite",
            root: "TweenLite" // indicates global variable
        }
    }
};