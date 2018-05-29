const test = require('interface-ipfs-core')
const IpfsFactory = require('./helpers/factories/node')

let factory
const factoryOpts = process.env.IPFS_NODE_TYPE === 'go'
  ? { type: 'go' }
  : { type: 'proc', exec: require('ipfs') }

const common = {
  setup (cb) {
    factory = new IpfsFactory(factoryOpts)
    cb(null, factory)
  },
  teardown (cb) {
    factory.dismantle(cb)
  }
}

test.block(common)
test.bootstrap(common)
test.config(common)
test.dag(common)
test.dht(common)
test.files(common)
test.filesMFS(common)
test.key(common)
test.miscellaneous(common)
test.object(common)
test.pin(common)
test.ping(common)
test.pubsub(common)
test.repo(common)
test.stats(common)
test.swarm(common)
