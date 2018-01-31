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
      },
      {
        pattern: 'node_modules/interface-ipfs-core/js/test/fixtures/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false
      }
    ],
    // https://github.com/ipfs/interface-ipfs-core/issues/213
    proxies: {
      '/base/node_modules/interface-ipfs-core/test/fixtures': '/base/node_modules/interface-ipfs-core/js/test/fixtures'
    },
    preprocessors: {
      'test/browser.js': ['browserify']
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
