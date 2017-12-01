var path = require('path');
var webpack = require('webpack')
var Visualizer = require('webpack-visualizer-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'parse-curl.js',
    library: 'parse-curl',
     libraryTarget: 'umd'
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {}
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }

    ],
  },
  "plugins": [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new Visualizer(),
  ],
};
