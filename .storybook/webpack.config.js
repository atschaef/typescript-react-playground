const path = require('path')

const BUILD_PATH = path.join(__dirname, '../build')
const SRC_PATH = path.join(__dirname, '../src')
const STORIES_PATH = path.join(__dirname, '../src/stories')
const TEST_PATH = path.join(__dirname, '../test')

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [BUILD_PATH, SRC_PATH, STORIES_PATH, TEST_PATH],
        use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }, { loader: 'ts-loader' }],
      },
      {
        test: /\.(png|json|svg)$/,
        include: [SRC_PATH],
        loader: 'file-loader',
        options: { limit: 10000, name: 'assets/[name].[ext]' },
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    enforceExtension: false,
  },
}
