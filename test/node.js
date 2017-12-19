const test = require('interface-ipfs-core')
const { createProxyClient, createProxyServer, closeProxyServer } = require('../lib')
const IpfsFactory = require('./helpers/ipfs-factory-instance')
const fakeWindows = require('./helpers/fake-windows')

let factory

const common = {
  setup (cb) {
    const ipfsServers = []

    factory = new IpfsFactory()

    const spawnNode = factory.spawnNode

    // When we spawn a new node, we give back ipfsClient
    // and hook up our ipfsServer to the new node
    factory.spawnNode = function () {
      const args = Array.from(arguments)
      const cb = args.pop()

      spawnNode.apply(factory, args.concat((err, ipfs) => {
        if (err) return cb(err)

        const [ serverWin, clientWin ] = fakeWindows()

        const ipfsServer = createProxyServer(() => ipfs, {
          addListener: serverWin.addEventListener,
          removeListener: serverWin.removeEventListener,
          postMessage: serverWin.postMessage
        })

        ipfsServers.push(ipfsServer)

        const ipfsClient = createProxyClient({
          addListener: clientWin.addEventListener,
          removeListener: clientWin.removeEventListener,
          postMessage: clientWin.postMessage
        })

        cb(null, ipfsClient)
      }))
    }

    const dismantle = factory.dismantle

    factory.dismantle = (cb) => {
      ipfsServers.forEach(closeProxyServer)
      dismantle.call(factory, cb)
    }

    cb(null, factory)
  },

  teardown: function (cb) {
    factory.dismantle(cb)
  }
}

test.block(common)
test.config(common)
// test.dag(common)
// test.dht(common)
// test.files(common)
// test.key(common)
// test.miscellaneous(common)
// test.object(common)
// test.pin(common)
// test.pubsub(common)
// test.swarm(common)
