import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import createBlock from './block'
import createConfig from './config'
import createDag from './dag'
import createDht from './dht'
import createFiles from './files'
import createKey from './key'
import createLs from './ls'
import createObject from './object'
import createPin from './pin'
import createPubsub from './pubsub'
import createSwarm from './swarm'

export default (opts) => {
  const ipfs = {
    id: callbackify(caller('ipfs.id', opts)),
    version: callbackify(caller('ipfs.version', opts)),
    dns: callbackify.variadic(caller('ipfs.dns', opts)),
    block: createBlock(opts),
    config: createConfig(opts),
    dag: createDag(opts),
    dht: createDht(opts),
    files: createFiles(opts),
    key: createKey(opts),
    object: createObject(opts),
    pin: createPin(opts),
    pubsub: createPubsub(opts),
    swarm: createSwarm(opts),
    stop: callbackify(caller('ipfs.stop', opts))
  }

  Object.assign(ipfs, createLs(opts))

  // Aliases
  ipfs.add = ipfs.files.add
  ipfs.get = ipfs.files.get
  ipfs.cat = ipfs.files.cat

  return ipfs
}
