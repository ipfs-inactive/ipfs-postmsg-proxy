const tests = require('interface-ipfs-core')
const IpfsFactory = require('./helpers/factories/browser')

const defaultCommonFactory = () => {
  let factory
  return {
    setup (cb) {
      factory = new IpfsFactory()
      cb(null, factory)
    },
    teardown (cb) {
      factory.dismantle(cb)
    }
  }
}

tests.bitswap(defaultCommonFactory, { skip: true })

tests.block(defaultCommonFactory)

tests.bootstrap(defaultCommonFactory)

tests.config(defaultCommonFactory)

tests.dag(defaultCommonFactory)

tests.dht(defaultCommonFactory, {
  skip: { reason: 'TODO: DHT is not implemented in js-ipfs yet!' }
})

tests.files(defaultCommonFactory, {
  skip: [
    {
      name: 'should add pull stream (promised)',
      reason: 'https://github.com/ipfs/js-ipfs/issues/1574'
    },
    {
      name: 'should stat file',
      reason: 'https://github.com/ipfs/interface-ipfs-core/pull/365'
    },
    {
      name: 'should stat dir',
      reason: 'https://github.com/ipfs/interface-ipfs-core/pull/365'
    },
    {
      name: 'should stat outside of mfs',
      reason: 'https://github.com/ipfs/interface-ipfs-core/pull/365'
    }
  ]
})

tests.key(defaultCommonFactory)

tests.ls(defaultCommonFactory)

tests.miscellaneous(defaultCommonFactory, {
  skip: [
    {
      name: 'should resolve an IPNS DNS link',
      reason: 'TODO IPNS not implemented yet'
    },
    {
      name: 'should resolve IPNS link recursively',
      reason: 'TODO IPNS not implemented yet'
    }
  ]
})

tests.name(defaultCommonFactory)

tests.object(defaultCommonFactory)

tests.pin(defaultCommonFactory)

tests.ping(defaultCommonFactory, { skip: true })

tests.pubsub(defaultCommonFactory, { skip: true })

tests.repo(defaultCommonFactory, {
  skip: [
    // repo.gc
    {
      name: 'gc',
      reason: 'TODO: repo.gc is not implemented in js-ipfs yet!'
    }
  ]
})

tests.stats(defaultCommonFactory)

tests.swarm(defaultCommonFactory, { skip: true })

tests.types(defaultCommonFactory, { skip: { reason: 'FIXME: currently failing' } })

tests.util(defaultCommonFactory, { skip: { reason: 'FIXME: currently failing' } })
