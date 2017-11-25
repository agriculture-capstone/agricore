const webpack = require('webpack')
const webpackMerge = require('webpack-merge')

const commonConfig = require('./base.config.js')
const { resolve } = require('./utils');

const isCoverage = process.env.NODE_ENV === 'coverage';

module.exports = function () {
  return webpackMerge(commonConfig(), {

    devtool: 'inline-cheap-module-source-map',

    module: {
      rules: [].concat(
        isCoverage ?
        // If coverage env set, intrument the source files to generate a coverage report
        {
          enforce: 'post',
          test: /\.(js|ts)/,
          include: resolve('src'),
          loader: 'istanbul-instrumenter-loader'
        } :
        // If not performing coverage, add linting to the build process
        // Seems to be an error with tslint-loader that interferes with source-maps
        {
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          include: [resolve('src'), resolve('test')],
          options: {
            configFile: resolve('tslint.json'),
            emitErrors: true,
            failOnHint: true,
            fix: false,
            tsConfigFile: resolve('tsconfig.json'),
            typeCheck: true,
          }
        }
      )
    },

    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('test'),
      })
    ]
  })
}
