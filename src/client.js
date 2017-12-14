const { caller } = require('postmsg-rpc')
const callbackify = require('callbackify')

module.exports = (opts) => {
  return {
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
    swarm: {
      peers: callbackify.variadic(caller('ipfs.swarm.peers', opts)),
      addrs: callbackify(caller('ipfs.swarm.addrs', opts)),
      localAddrs: callbackify(caller('ipfs.swarm.localAddrs', opts)),
      connect: callbackify.variadic(caller('ipfs.swarm.connect', opts)),
      disconnect: callbackify.variadic(caller('ipfs.swarm.disconnect', opts))
    }
  }
}
