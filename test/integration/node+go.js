const tests = require('interface-ipfs-core')
const IpfsFactory = require('./helpers/factories/node')

const defaultCommonFactory = () => {
  let factory
  return {
    setup (cb) {
      factory = new IpfsFactory({
        factory: { type: 'go' },
        spawn: { initOptions: { bits: 1024 } }
      })
      cb(null, factory)
    },
    teardown (cb) {
      factory.dismantle(cb)
    }
  }
}

tests.bitswap(defaultCommonFactory, {
  skip: [
    // bitswap.stat
    {
      name: 'should not get bitswap stats when offline',
      reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
    },
    // bitswap.wantlist
    {
      name: 'should not get the wantlist when offline',
      reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
    },
    // bitswap.unwant
    {
      name: 'should remove a key from the wantlist',
      reason: 'FIXME why is this skipped?'
    },
    {
      name: 'should not remove a key from the wantlist when offline',
      reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
    }
  ]
})

tests.block(defaultCommonFactory)

tests.bootstrap(defaultCommonFactory)

tests.config(defaultCommonFactory, {
  skip: [
    // config.replace
    {
      name: 'replace',
      reason: 'FIXME Waiting for fix on go-ipfs https://github.com/ipfs/js-ipfs-api/pull/307#discussion_r69281789 and https://github.com/ipfs/go-ipfs/issues/2927'
    }
  ]
})

tests.dag(defaultCommonFactory, {
  skip: [
    // dag.tree
    {
      name: 'tree',
      reason: 'TODO vmx 2018-02-22: Currently the tree API is not exposed in go-ipfs'
    },
    // dag.get:
    {
      name: 'should get a dag-pb node local value',
      reason: 'FIXME vmx 2018-02-22: Currently not supported in go-ipfs, it might be possible once https://github.com/ipfs/go-ipfs/issues/4728 is done'
    },
    {
      name: 'should get dag-pb value via dag-cbor node',
      reason: 'FIXME vmx 2018-02-22: Currently not supported in go-ipfs, it might be possible once https://github.com/ipfs/go-ipfs/issues/4728 is done'
    },
    {
      name: 'should get by CID string + path',
      reason: 'FIXME vmx 2018-02-22: Currently not supported in go-ipfs, it might be possible once https://github.com/ipfs/go-ipfs/issues/4728 is done'
    }
  ]
})

tests.dht(defaultCommonFactory, {
  skip: [
    // dht.findpeer
    {
      name: 'should fail to find other peer if peer does not exist',
      reason: 'FIXME checking what is exactly go-ipfs returning https://github.com/ipfs/go-ipfs/issues/3862#issuecomment-294168090'
    },
    // dht.findprovs
    {
      name: 'should provide from one node and find it through another node',
      reason: 'FIXME go-ipfs endpoint doesn\'t conform with the others https://github.com/ipfs/go-ipfs/issues/5047'
    },
    // dht.get
    {
      name: 'should get a value after it was put on another node',
      reason: 'FIXME go-ipfs errors with  Error: key was not found (type 6) https://github.com/ipfs/go-ipfs/issues/3862'
    }
  ]
})

tests.files(defaultCommonFactory, {
  skip: [
    // files.catPullStream
    {
      name: 'should export a chunk of a file',
      reason: 'TODO not implemented in go-ipfs yet'
    },
    {
      name: 'should export a chunk of a file in a Pull Stream',
      reason: 'TODO not implemented in go-ipfs yet'
    },
    {
      name: 'should export a chunk of a file in a Readable Stream',
      reason: 'TODO not implemented in go-ipfs yet'
    }
  ]
})

tests.key(defaultCommonFactory, {
  skip: [
    // key.export
    {
      name: 'export',
      reason: 'TODO not implemented in go-ipfs yet'
    },
    // key.import
    {
      name: 'import',
      reason: 'TODO not implemented in go-ipfs yet'
    }
  ]
})

tests.ls(defaultCommonFactory)

tests.miscellaneous(defaultCommonFactory, {
  skip: [
    // stop
    {
      name: 'should stop the node',
      reason: 'FIXME go-ipfs returns an error https://github.com/ipfs/go-ipfs/issues/4078'
    }
  ]
})

tests.object(defaultCommonFactory)

tests.pin(defaultCommonFactory)

tests.ping(defaultCommonFactory)

tests.pubsub(defaultCommonFactory)

tests.repo(defaultCommonFactory)

tests.stats(defaultCommonFactory)

tests.swarm(defaultCommonFactory)

tests.types(defaultCommonFactory, { skip: { reason: 'FIXME currently failing' } })

tests.util(defaultCommonFactory, { skip: { reason: 'FIXME currently failing' } })
