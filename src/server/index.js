import { expose } from 'postmsg-rpc'
import createBlock from './block'
import createConfig from './config'
import createDag from './dag'
import createDht from './dht'
import createFiles from './files'
import createKey from './key'
import createObject from './object'
import createPin from './pin'
import createPubsub from './pubsub'
import createSwarm from './swarm'

export default (getIpfs, opts) => {
  return {
    id: expose('ipfs.id', () => getIpfs().id(), opts),
    version: expose('ipfs.version', () => getIpfs().version(), opts),
    block: createBlock(getIpfs, opts),
    config: createConfig(getIpfs, opts),
    dag: createDag(getIpfs, opts),
    dht: createDht(getIpfs, opts),
    files: createFiles(getIpfs, opts),
    key: createKey(getIpfs, opts),
    object: createObject(getIpfs, opts),
    pin: createPin(getIpfs, opts),
    pubsub: createPubsub(getIpfs, opts),
    swarm: createSwarm(getIpfs, opts)
  }
}

export function closeProxyServer (obj) {
  Object.keys(obj).forEach((k) => {
    if (obj[k].close) {
      obj[k].close()
    } else {
      closeProxyServer(obj[k])
    }
  })
}
