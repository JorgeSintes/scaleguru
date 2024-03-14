const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    // Remove devtool or set it to 'source-map' or 'hidden-source-map' if you need source maps in production
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].bundle.js',
        clean: true, // Clean the /dist folder before each build
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('production'),
        // }),
    ],
    optimization: {
        minimize: true,
        usedExports: true,
        // More optimization options can be added here
    },
    externals: {
        "vexflow": "Vex",
        "tone": "Tone",
    }
});
