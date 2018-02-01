import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { peerInfoToJson } from '../serialization/peer'
import { preMultiaddrFromJson, multiaddrToJson } from '../serialization/multiaddr'
import { preBufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    peers: expose('ipfs.swarm.peers', pre(
      opts.pre('swarm.peers'),
      post(
        (...args) => getIpfs().swarm.peers(...args),
        (res) => res.map((item) => {
          item.addr = multiaddrToJson(item.addr)
          item.peer = peerInfoToJson(item.peer)
          return item
        })
      )
    ), opts),
    addrs: expose('ipfs.swarm.addrs', pre(
      opts.pre('swarm.addrs'),
      post(
        () => getIpfs().swarm.addrs(),
        (res) => res.map(peerInfoToJson)
      )
    ), opts),
    localAddrs: expose('ipfs.swarm.localAddrs', pre(
      opts.pre('swarm.localAddrs'),
      post(
        () => getIpfs().swarm.localAddrs(),
        (res) => res.map(multiaddrToJson)
      )
    ), opts),
    connect: expose('ipfs.swarm.connect', pre(
      preBufferFromJson(0),
      preMultiaddrFromJson(0),
      opts.pre('swarm.connect'),
      (...args) => getIpfs().swarm.connect(...args)
    ), opts),
    disconnect: expose('ipfs.swarm.disconnect', pre(
      preBufferFromJson(0),
      preMultiaddrFromJson(0),
      opts.pre('swarm.disconnect'),
      (...args) => getIpfs().swarm.disconnect(...args)
    ), opts)
  }
}
