const { createProxyClient, createProxyServer, closeProxyServer } = require('../../../lib')
const fakeWindows = require('../fake-windows')
const Async = require('async')
const DaemonFactory = require('ipfsd-ctl')

class NodeIpfsFactory {
  constructor (opts) {
    this.df = DaemonFactory.create(opts)
    this.handles = []
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

    const opts = { config, args: [] }

    if (config.EXPERIMENTAL.pubsub) {
      opts.args.push('--enable-pubsub-experiment')
    }

    // https://github.com/ipfs/js-ipfsd-ctl/issues/208
    opts.EXPERIMENTAL = config.EXPERIMENTAL

    this.df.spawn(opts, (err, ipfsd) => {
      if (err) return cb(err)

      const [ serverWin, clientWin ] = fakeWindows()

      const ipfsServer = createProxyServer(() => ipfsd.api, {
        addListener: serverWin.addEventListener,
        removeListener: serverWin.removeEventListener,
        postMessage: serverWin.postMessage
      })

      this.handles.push({ ipfsd, ipfsServer })

      const ipfsClient = createProxyClient({
        addListener: clientWin.addEventListener,
        removeListener: clientWin.removeEventListener,
        postMessage: clientWin.postMessage
      })

      cb(null, ipfsClient)
    })
  }

  dismantle (cb) {
    Async.each(this.handles, (handle, cb) => {
      closeProxyServer(handle.ipfsServer)
      handle.ipfsd.stop(cb)
    }, cb)
  }
}

module.exports = NodeIpfsFactory
