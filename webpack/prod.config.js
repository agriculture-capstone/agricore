const webpack = require('webpack')
const webpackMerge = require('webpack-merge')

const commonConfig = require('./base.config.js')
const { resolve } = require('./utils');

module.exports = function () {
  return webpackMerge(commonConfig(), {

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
            failOnHint: true,
            fix: false,
            tsConfigFile: resolve('tsconfig.json'),
            typeCheck: true,
          }
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('production'),
      })
    ]
  })
}
