const webpack = require('webpack')
const webpackMerge = require('webpack-merge')

const commonConfig = require('./base.config.js')

module.exports = function () {
  return webpackMerge(commonConfig(), {
    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('production'),
      })
    ]
  })
}
