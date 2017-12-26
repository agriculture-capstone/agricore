const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path');
const webpackNotifierPlugin = require('webpack-notifier');
const friendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const commonConfig = require('./base.config.js')
const { resolve } = require('./utils');

const icon = path.join(__dirname, 'icon.svg');

const isNotifying = process.env.NODE_ENV === 'notify';

module.exports = function () {
  return webpackMerge(commonConfig(), {
    devtool: 'source-map',

    stats: 'none',

    module: {
      rules: [

        // All .ts files will be linted by 'tslint'
        {
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          include: [resolve('src/'), resolve('test/')],
          options: {
            configFile: resolve('tslint.json'),
            emitErrors: true,
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

      new friendlyErrorsPlugin(),

      new webpack.EnvironmentPlugin({
        NODE_ENV: JSON.stringify('development'),
      }),
    ].concat(
      isNotifying
      ? new webpackNotifierPlugin({
        title: 'Core',
        contentImage: icon,
      })
      : []
    )
  })
}
