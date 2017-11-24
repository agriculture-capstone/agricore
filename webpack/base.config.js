const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const { ROOT, resolve } = require('./utils');

module.exports = function () {
  return {
    entry: {
      app: path.join(ROOT, 'src', 'main.ts')
    },
    output: {
      path: resolve('dist'),
      filename: '[name].js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@': resolve('src'),
        '@root': ROOT
      },
      symlinks: false,
      plugins: [
        new TsConfigPathsPlugin()
      ]
    },
    target: 'node',
    node: {
      __dirname: true
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: "source-map-loader"
        },
        // All files with a '.ts' extension will be handled by 'awesome-typescript-loader'.
        {
          test: /\.ts$/,
          loaders: [
            "awesome-typescript-loader"
          ]
        }
      ]
    }
  }
}
