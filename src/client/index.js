import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
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
    swarm: createSwarm(opts)
  }

  // Aliases
  ipfs.add = ipfs.files.add
  ipfs.ls = ipfs.files.ls
  ipfs.lsReadableStream = ipfs.files.lsReadableStream
  ipfs.lsPullStream = ipfs.files.lsPullStream

  return ipfs
}
