const Path = require('path')

module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: ['test/browser.js'],
    middleware: ['static'],
    static: {
      path: Path.join(__dirname, 'test', 'fixtures', 'public')
    },
    preprocessors: {
      'test/browser.js': ['browserify']
    },
    browserify: {
      debug: true
    }
  })
}
