const { createProxyClient, createProxyServer, closeProxyServer } = require('../../../lib')
const IpfsFactory = require('./ipfs-factory-instance')
const fakeWindows = require('../fake-windows')

class NodeIpfsFactory extends IpfsFactory {
  constructor () {
    super()
    this.ipfsServers = []
  }

  // When we spawn a new node, we give back ipfsClient
  // and hook up our ipfsServer to the new node
  spawnNode () {
    const args = Array.from(arguments)
    const cb = args.pop()

    super.spawnNode.apply(this, args.concat((err, ipfs) => {
      if (err) return cb(err)

      const [ serverWin, clientWin ] = fakeWindows()

      const ipfsServer = createProxyServer(() => ipfs, {
        addListener: serverWin.addEventListener,
        removeListener: serverWin.removeEventListener,
        postMessage: serverWin.postMessage
      })

      this.ipfsServers.push(ipfsServer)

      const ipfsClient = createProxyClient({
        addListener: clientWin.addEventListener,
        removeListener: clientWin.removeEventListener,
        postMessage: clientWin.postMessage
      })

      cb(null, ipfsClient)
    }))
  }

  dismantle (cb) {
    this.ipfsServers.forEach(closeProxyServer)
    super.dismantle(cb)
  }
}

module.exports = NodeIpfsFactory
