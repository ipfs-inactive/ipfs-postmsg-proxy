const test = require('interface-ipfs-core')
const createIpfsClient = require('../src/client')
const createIpfsServer = require('../src/server')
const IpfsFactory = require('./helpers/ipfs-factory-instance')
const fakeWindows = require('./helpers/fake-windows')

const common = () => {
  let ipfsServer, factory

  return {
    setup (cb) {
      let ipfs
      const [ serverWin, clientWin ] = fakeWindows()

      const ipfsClient = createIpfsClient({
        addListener: clientWin.addEventListener,
        removeListener: clientWin.removeEventListener,
        postMessage: clientWin.postMessage
      })

      ipfsServer = createIpfsServer(() => ipfs, {
        addListener: serverWin.addEventListener,
        removeListener: serverWin.removeEventListener,
        postMessage: serverWin.postMessage
      })

      factory = new IpfsFactory()

      const spawnNode = factory.spawnNode

      // When we spawn a new node, we give back ipfsClient
      // and hook up our ipfsServer to the new node
      factory.spawnNode = function () {
        const args = Array.from(arguments)
        const cb = args.pop()

        spawnNode.apply(factory, args.concat((err, node) => {
          if (err) return cb(err)
          ipfs = node
          cb(null, ipfsClient)
        }))
      }

      cb(null, factory)
    },

    teardown: function (cb) {
      ipfsServer.id.close()
      ipfsServer.version.close()
      factory.dismantle(cb)
    }
  }
}

test.miscellaneous(common())
