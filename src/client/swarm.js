import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { peerInfoFromJson } from '../serialization/peer'
import { preMultiaddrToJson, multiaddrFromJson } from '../serialization/multiaddr'
import { preBufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    peers: callbackify.variadic(
      post(
        caller('ipfs.swarm.peers', opts),
        (res) => Promise.all(
          res.map((item) => (
            peerInfoFromJson(item.peer)
              .then((peerInfo) => {
                item.addr = multiaddrFromJson(item.addr)
                item.peer = peerInfo
                return item
              })
          ))
        )
      )
    ),
    addrs: callbackify(
      post(
        caller('ipfs.swarm.addrs', opts),
        (res) => Promise.all(res.map(peerInfoFromJson))
      )
    ),
    localAddrs: callbackify(
      post(
        caller('ipfs.swarm.localAddrs', opts),
        (res) => res.map(multiaddrFromJson)
      )),
    connect: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preMultiaddrToJson(0),
        caller('ipfs.swarm.connect', opts)
      )
    ),
    disconnect: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preMultiaddrToJson(0),
        caller('ipfs.swarm.disconnect', opts)
      )
    )
  }
}
