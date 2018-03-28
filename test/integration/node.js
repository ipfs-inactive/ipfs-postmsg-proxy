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
test.key(common) // (not implemented yet in js-ipfs)
test.miscellaneous(common)
// test.name(common)
test.object(common)
test.pin(common) // (not implemented yet in js-ipfs)
test.pubsub(common)
test.repo(common)
test.stats(common)
test.swarm(common)
