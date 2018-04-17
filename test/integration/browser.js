const test = require('interface-ipfs-core')
const IpfsFactory = require('./helpers/factories/browser')

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
test.pubsub(common)
test.repo(common)
test.stats(common)
test.swarm(common)
