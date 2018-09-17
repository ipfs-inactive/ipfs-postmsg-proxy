const { createProxyClient, createProxyServer, closeProxyServer } = require('../../../../lib')
const mockWindow = require('../../../helpers/mock-window')
const each = require('async/each')
const DaemonFactory = require('ipfsd-ctl')

class NodeIpfsFactory {
  constructor (options) {
    options = options || {}
    this.df = DaemonFactory.create(options.factory)
    this.handles = []
    this._spawnOptions = options.spawn || {}
  }

  // When we spawn a new node, we give back ipfsClient
  // and hook up our ipfsServer to the new node
  spawnNode () {
    const args = Array.from(arguments)
    const cb = args.pop()
    const config = Object.assign({
      EXPERIMENTAL: {
        dht: true,
        pubsub: true
      },
      relay: {
        enabled: true,
        hop: {
          enabled: true
        }
      }
    }, args.pop())

    const opts = Object.assign({ config, args: [] }, this._spawnOptions)

    if (config.EXPERIMENTAL.pubsub) {
      opts.args.push('--enable-pubsub-experiment')
    }

    // https://github.com/ipfs/js-ipfsd-ctl/issues/208
    opts.EXPERIMENTAL = config.EXPERIMENTAL

    this.df.spawn(opts, (err, ipfsd) => {
      if (err) return cb(err)

      const serverWin = mockWindow()
      const clientWin = mockWindow()

      const ipfsServer = createProxyServer(() => ipfsd.api, {
        addListener: serverWin.addEventListener,
        removeListener: serverWin.removeEventListener,
        postMessage: clientWin.postMessage
      })

      this.handles.push({ ipfsd, ipfsServer })

      const ipfsClient = createProxyClient({
        addListener: clientWin.addEventListener,
        removeListener: clientWin.removeEventListener,
        postMessage: serverWin.postMessage
      })

      cb(null, ipfsClient)
    })
  }

  dismantle (cb) {
    each(this.handles, (handle, cb) => {
      closeProxyServer(handle.ipfsServer)
      handle.ipfsd.stop(cb)
    }, cb)
  }
}

module.exports = NodeIpfsFactory
