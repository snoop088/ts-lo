// webpack.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const config = {
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
    devtool: 'eval-source-map',
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
}
module.exports = (env, argv) => {
    if (argv.mode === 'production') {
        const optiConfig = Object.assign(config, {
            optimization: {
                minimize: true,
                minimizer: [new TerserPlugin(
                    {
                        terserOptions: {
                            ecma: 2016,
                            compress: { defaults: true },
                            mangle: true, // Note `mangle.properties` is `false` by default.
                        },
                    }
                )
                ]
            },
            devtool: 'hidden-source-map'
        });
        return optiConfig
    }
    return config
};