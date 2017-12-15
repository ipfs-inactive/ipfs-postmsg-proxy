const { caller } = require('postmsg-rpc')
const callbackify = require('callbackify')

module.exports = (opts) => {
  const ipfs = {
    id: callbackify(caller('ipfs.id', opts)),
    version: callbackify(caller('ipfs.version', opts)),
    block: {
      put: callbackify.variadic(caller('ipfs.block.put', opts)),
      get: callbackify.variadic(caller('ipfs.block.get', opts)),
      stat: callbackify.variadic(caller('ipfs.block.stat', opts))
    },
    config: {
      set: callbackify.variadic(caller('ipfs.config.set', opts)),
      get: callbackify.variadic(caller('ipfs.config.get', opts))
    },
    dag: {
      put: callbackify.variadic(caller('ipfs.dag.put', opts)),
      get: callbackify.variadic(caller('ipfs.dag.get', opts)),
      tree: callbackify.variadic(caller('ipfs.dag.tree', opts))
    },
    dht: {
      put: callbackify.variadic(caller('ipfs.dht.put', opts)),
      get: callbackify.variadic(caller('ipfs.dht.get', opts)),
      findprovs: callbackify.variadic(caller('ipfs.dht.findprovs', opts)),
      findpeer: callbackify.variadic(caller('ipfs.dht.findpeer', opts)),
      provide: callbackify.variadic(caller('ipfs.dht.provide', opts)),
      query: callbackify.variadic(caller('ipfs.dht.query', opts))
    },
    files: {
      add: callbackify.variadic(caller('ipfs.files.add', opts)),
      // addReadableStream: callbackify.variadic(caller('ipfs.files.addReadableStream', opts)),
      // addPullStream: callbackify.variadic(caller('ipfs.files.addPullStream', opts)),
      cat: callbackify.variadic(caller('ipfs.files.cat', opts)),
      // catReadableStream: callbackify.variadic(caller('ipfs.files.catReadableStream', opts)),
      // catPullStream: callbackify.variadic(caller('ipfs.files.catPullStream', opts)),
      get: callbackify.variadic(caller('ipfs.files.get', opts))
    },
    ls: callbackify.variadic(caller('ipfs.ls', opts)),
    // lsReadableStream: callbackify.variadic(caller('ipfs.files.catReadableStream', opts)),
    // lsPullStream: callbackify.variadic(caller('ipfs.files.catPullStream', opts)),
    key: {
      gen: callbackify.variadic(caller('ipfs.key.gen', opts)),
      list: callbackify(caller('ipfs.key.list', opts)),
      rename: callbackify.variadic(caller('ipfs.key.rename', opts)),
      rm: callbackify.variadic(caller('ipfs.key.rm', opts))
    },
    object: {
      new: callbackify.variadic(caller('ipfs.object.new', opts)),
      put: callbackify.variadic(caller('ipfs.object.put', opts)),
      get: callbackify.variadic(caller('ipfs.object.get', opts)),
      data: callbackify.variadic(caller('ipfs.object.data', opts)),
      links: callbackify.variadic(caller('ipfs.object.links', opts)),
      stat: callbackify.variadic(caller('ipfs.object.stat', opts)),
      patch: {
        addLink: callbackify.variadic(caller('ipfs.object.patch.addLink', opts)),
        rmLink: callbackify.variadic(caller('ipfs.object.patch.rmLink', opts)),
        appendData: callbackify.variadic(caller('ipfs.object.patch.appendData', opts)),
        setData: callbackify.variadic(caller('ipfs.object.patch.setData', opts))
      }
    },
    pin: {
      add: callbackify.variadic(caller('ipfs.pin.add', opts)),
      rm: callbackify.variadic(caller('ipfs.pin.rm', opts)),
      ls: callbackify.variadic(caller('ipfs.pin.ls', opts))
    },
    pubsub: {
      publish: callbackify.variadic(caller('ipfs.pubsub.publish', opts)),
      // subscribe: callbackify.variadic(caller('ipfs.pubsub.subscribe', opts)),
      // unsubscribe: callbackify.variadic(caller('ipfs.pubsub.unsubscribe', opts)),
      peers: callbackify.variadic(caller('ipfs.pubsub.peers', opts)),
      ls: callbackify.variadic(caller('ipfs.pubsub.ls', opts))
    },
    swarm: {
      peers: callbackify.variadic(caller('ipfs.swarm.peers', opts)),
      addrs: callbackify(caller('ipfs.swarm.addrs', opts)),
      localAddrs: callbackify(caller('ipfs.swarm.localAddrs', opts)),
      connect: callbackify.variadic(caller('ipfs.swarm.connect', opts)),
      disconnect: callbackify.variadic(caller('ipfs.swarm.disconnect', opts))
    }
  }

  // Aliases
  ipfs.add = ipfs.files.add

  return ipfs
}
