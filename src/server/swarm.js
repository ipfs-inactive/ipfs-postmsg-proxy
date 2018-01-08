import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { peerInfoToJson } from '../serialization/peer'
import { isMultiaddrJson, multiaddrFromJson, multiaddrToJson } from '../serialization/multiaddr'
import { preCall, postCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    peers: expose('ipfs.swarm.peers', preCall(
      opts.preCall['swarm.peers'],
      postCall(
        (...args) => getIpfs().swarm.peers(...args),
        (res) => res.map((item) => {
          item.addr = multiaddrToJson(item.addr)
          item.peer = peerInfoToJson(item.peer)
          return item
        })
      )
    ), opts),
    addrs: expose('ipfs.swarm.addrs', preCall(
      opts.preCall['swarm.addrs'],
      postCall(
        () => getIpfs().swarm.addrs(),
        (res) => res.map(peerInfoToJson)
      )
    ), opts),
    localAddrs: expose('ipfs.swarm.localAddrs', preCall(
      opts.preCall['swarm.localAddrs'],
      postCall(
        () => getIpfs().swarm.localAddrs(),
        (res) => res.map(multiaddrToJson)
      )
    ), opts),
    connect: expose('ipfs.swarm.connect', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isMultiaddrJson(args[0])) {
          args[0] = multiaddrFromJson(args[0])
        }

        return args
      },
      opts.preCall['swarm.connect'],
      (...args) => getIpfs().swarm.connect(...args)
    ), opts),
    disconnect: expose('ipfs.swarm.disconnect', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isMultiaddrJson(args[0])) {
          args[0] = multiaddrFromJson(args[0])
        }

        return args
      },
      opts.preCall['swarm.disconnect'],
      (...args) => getIpfs().swarm.disconnect(...args)
    ), opts)
  }
}
