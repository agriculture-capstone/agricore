const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const commonConfig = require('./base.config.js')

module.exports = function () {
  return webpackMerge(commonConfig(), {
    devtool: 'source-map',
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

      new FriendlyErrorsPlugin(),

      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('development'),
      })
    ]
  })
}
