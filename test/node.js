const test = require('interface-ipfs-core')
const IpfsFactory = require('./helpers/factories/node')

let factory

const common = {
  setup (cb) {
    factory = new IpfsFactory()
    cb(null, factory)
  },
  teardown (cb) {
    factory.dismantle(cb)
  }
}

test.block(common)
test.config(common)
test.dag(common)
test.dht(common)
test.files(common)
// test.key(common) // (not implemented yet in js-ipfs)
test.miscellaneous(common)
test.object(common)
// test.pin(common) // (not implemented yet in js-ipfs)
test.pubsub(common)
test.swarm(common)
