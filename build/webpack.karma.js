const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')
const { join } = require('path')
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const TEST = join(ROOT, 'test')
const UNIT = join(TEST, 'unit')
const NODE_MODULES = join(ROOT, 'node_modules')

module.exports = {
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [SRC, UNIT],
        use: [
          { loader: 'babel-loader', options: { cacheDirectory: true } },
          { loader: 'ts-loader', options: { transpileOnly: true } },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: [NODE_MODULES, TEST, join(SRC, 'types'), join(SRC, 'stories'), join(SRC, 'style')],
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post',
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [NODE_MODULES],
    alias: { lodash: 'lodash-es' },
  },

  externals: { cheerio: 'window' },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new ForkTsCheckerNotifierWebpackPlugin({ excludeWarnings: true }),
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('test'),
        API_PATH: JSON.stringify(''),
      },
    }),
  ],
}
