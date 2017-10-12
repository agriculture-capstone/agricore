const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const root = path.resolve(__dirname, '..')

/** Resolve file or directory in root */
function resolve(dirOrFile) {
  return path.join(root, dirOrFile)
}

module.exports = function () {
  return {
    entry: {
      app: path.join(root, 'src', 'index.ts'),
      test: path.join(root, 'test', 'index.ts')
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
        '@root': root
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
        // All .ts files will be linted by 'tslint'
        {
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          include: [resolve('src'), resolve('test')],
          options: {
            configFile: resolve('tslint.json'),
            emitErrors: false,
            fix: false,
            tsConfigFile: resolve('tsconfig.json')
          }
        },
        // All files with a '.ts' extension will be handled by 'awesome-typescript-loader'.
        {
          test: /\.ts$/,
          loaders: [
            "awesome-typescript-loader"
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        CORE_ROOT: JSON.stringify(resolve('.'))
      })
    ]
  }
}
