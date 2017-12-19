module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: [
      'test/browser.js',
      {
        pattern: 'test/fixtures/public/**/*',
        watched: true,
        included: false,
        served: true,
        nocache: false
      }
    ],
    preprocessors: {
      'test/browser.js': ['browserify']
    },
    browserify: {
      debug: true
    }
  })
}
