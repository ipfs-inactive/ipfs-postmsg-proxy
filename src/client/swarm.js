import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { peerInfoFromJson } from '../serialization/peer'
import { isMultiaddr, multiaddrToJson, multiaddrFromJson } from '../serialization/multiaddr'
import { isBuffer, bufferToJson } from '../serialization/buffer'

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
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isMultiaddr(args[0])) {
            args[0] = multiaddrToJson(args[0])
          }

          return args
        },
        caller('ipfs.swarm.connect', opts)
      )
    ),
    disconnect: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isMultiaddr(args[0])) {
            args[0] = multiaddrToJson(args[0])
          }

          return args
        },
        caller('ipfs.swarm.disconnect', opts)
      )
    )
  }
}
