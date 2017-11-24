const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const commonConfig = require('./base.config.js')
const { resolve } = require('./utils');

module.exports = function () {
  return webpackMerge(commonConfig(), {
    devtool: 'source-map',

    module: {
      rules: [

        // All .ts files will be linted by 'tslint'
        {
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          include: [resolve('src'), resolve('test')],
          options: {
            configFile: resolve('tslint.json'),
            emitErrors: false,
            failOnHint: false,
            fix: false,
            tsConfigFile: resolve('tsconfig.json'),
            typeCheck: true,
          }
        }
      ]
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

      new FriendlyErrorsPlugin(),

      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('development'),
      })
    ]
  })
}
