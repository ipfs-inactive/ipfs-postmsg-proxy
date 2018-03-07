module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: [
      'test/integration/browser.js',
      {
        pattern: 'test/integration/fixtures/public/**/*',
        watched: true,
        included: false,
        served: true,
        nocache: false
      },
      {
        pattern: 'node_modules/interface-ipfs-core/js/test/fixtures/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false
      }
    ],
    preprocessors: {
      'test/integration/browser.js': ['browserify']
    },
    browserify: {
      debug: true
    },
    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html'
      }
    }
  })
}
