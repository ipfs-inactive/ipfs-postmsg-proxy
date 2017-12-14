const { expose } = require('postmsg-rpc')

module.exports = (getIpfs, opts) => {
  return {
    id: expose('ipfs.id', () => getIpfs().id(), opts),
    version: expose('ipfs.version', () => getIpfs().version(), opts),
    block: {
      put: expose('ipfs.block.put', (...args) => getIpfs().block.put(...args), opts),
      get: expose('ipfs.block.get', (...args) => getIpfs().block.get(...args), opts),
      stat: expose('ipfs.block.stat', (...args) => getIpfs().block.stat(...args), opts)
    },
    config: {
      set: expose('ipfs.config.set', (...args) => getIpfs().config.set(...args), opts),
      get: expose('ipfs.config.get', (...args) => getIpfs().config.get(...args), opts)
    },
    dag: {
      put: expose('ipfs.dag.put', (...args) => getIpfs().dag.put(...args), opts),
      get: expose('ipfs.dag.get', (...args) => getIpfs().dag.get(...args), opts),
      tree: expose('ipfs.dag.tree', (...args) => getIpfs().dag.tree(...args), opts)
    },
    dht: {
      put: expose('ipfs.dht.put', (...args) => getIpfs().dht.put(...args), opts),
      get: expose('ipfs.dht.get', (...args) => getIpfs().dht.get(...args), opts),
      findprovs: expose('ipfs.dht.findprovs', (...args) => getIpfs().dht.findprovs(...args), opts),
      findpeer: expose('ipfs.dht.findpeer', (...args) => getIpfs().dht.findpeer(...args), opts),
      provide: expose('ipfs.dht.provide', (...args) => getIpfs().dht.provide(...args), opts),
      query: expose('ipfs.dht.query', (...args) => getIpfs().dht.query(...args), opts)
    },
    swarm: {
      peers: expose('ipfs.swarm.peers', (...args) => getIpfs().swarm.peers(...args), opts),
      addrs: expose('ipfs.swarm.addrs', () => getIpfs().swarm.addrs(), opts),
      localAddrs: expose('ipfs.swarm.localAddrs', () => getIpfs().swarm.localAddrs(), opts),
      connect: expose('ipfs.swarm.connect', (...args) => getIpfs().swarm.connect(...args), opts),
      disconnect: expose('ipfs.swarm.disconnect', (...args) => getIpfs().swarm.disconnect(...args), opts)
    }
  }
}
