const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts', // Ensure your entry point is correct
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // Adds CSS to the DOM by injecting a <style> tag
          'css-loader', // Interprets @import and url() like import/require() and will resolve them
          'postcss-loader', // Processes CSS with PostCSS
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
