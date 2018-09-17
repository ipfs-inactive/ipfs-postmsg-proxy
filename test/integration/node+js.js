const tests = require('interface-ipfs-core')
const IpfsFactory = require('./helpers/factories/node')
const Ipfs = require('ipfs')

const defaultCommonFactory = () => {
  let factory
  return {
    setup (cb) {
      factory = new IpfsFactory({
        factory: { type: 'proc', exec: Ipfs },
        spawn: { initOptions: { bits: 512 } }
      })
      cb(null, factory)
    },
    teardown (cb) {
      factory.dismantle(cb)
    }
  }
}

const passwordCommonFactory = () => {
  let factory
  return {
    setup (cb) {
      factory = new IpfsFactory({
        factory: { type: 'proc', exec: Ipfs },
        spawn: {
          args: ['--pass ipfs-is-awesome-software'],
          initOptions: { bits: 512 }
        }
      })
      cb(null, factory)
    },
    teardown (cb) {
      factory.dismantle(cb)
    }
  }
}

tests.bitswap(defaultCommonFactory)

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

tests.key(() => {
  let factory
  return {
    setup (cb) {
      factory = new IpfsFactory({
        factory: { type: 'proc', exec: Ipfs },
        spawn: {
          args: ['--pass ipfs-is-awesome-software'],
          initOptions: { bits: 512 }
        }
      })
      cb(null, factory)
    },
    teardown (cb) {
      factory.dismantle(cb)
    }
  }
})

tests.ls(defaultCommonFactory)

tests.miscellaneous(() => {
  let factory
  return {
    setup (cb) {
      factory = new IpfsFactory({
        factory: { type: 'proc', exec: Ipfs },
        spawn: {
          args: ['--pass ipfs-is-awesome-software'],
          initOptions: { bits: 512 }
        }
      })
      cb(null, factory)
    },
    teardown (cb) {
      factory.dismantle((err) => {
        if (err) {
          // These tests stop the node
          if (err.message !== 'Already stopped') return cb(err)
        }
        cb()
      })
    }
  }
}, {
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

tests.name(passwordCommonFactory)

tests.object(defaultCommonFactory)

tests.pin(defaultCommonFactory)

tests.ping(defaultCommonFactory, {
  skip: [
    {
      name: 'should fail when pinging an unknown peer',
      reason: 'Timing out'
    },
    {
      name: 'should fail when pinging an unknown peer over pull stream',
      reason: 'Timing out'
    },
    {
      name: 'should fail when pinging an unknown peer over readable stream',
      reason: 'Timing out'
    }
  ]
})

tests.pubsub(defaultCommonFactory)

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

tests.swarm(defaultCommonFactory, {
  skip: [
    {
      name: 'should get a list of node addresses',
      reason: 'Returning empty array'
    },
    {
      name: 'should get a list of node addresses (promised)',
      reason: 'Returning empty array'
    }
  ]
})

tests.types(defaultCommonFactory, { skip: { reason: 'FIXME: currently failing' } })

tests.util(defaultCommonFactory, { skip: { reason: 'FIXME: currently failing' } })
