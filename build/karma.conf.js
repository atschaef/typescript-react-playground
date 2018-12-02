const webpackConfig = require('./webpack.karma')

module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },

    browserConsoleLogOptions: {
      terminal: true,
      level: '',
    },

    singleRun: true,

    frameworks: ['mocha'],

    files: [{ pattern: '../test/unit/test_index.js', watched: false }],

    preprocessors: { '../test/unit/test_index.js': ['webpack', 'sourcemap'] },

    reporters: ['mocha', 'coverage-istanbul'],

    mochaReporter: {
      showDiff: true,
      output: 'autowatch',
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },

    webpack: webpackConfig,

    webpackServer: { noInfo: true },
  })
}
