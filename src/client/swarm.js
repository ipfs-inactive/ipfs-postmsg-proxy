import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { peerInfoFromJson } from '../serialization/peer'
import { isMultiaddr, multiaddrToJson, multiaddrFromJson } from '../serialization/multiaddr'
import { preCall, postCall } from '../fn-call'

export default function (opts) {
  return {
    peers: callbackify.variadic(
      postCall(
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
      postCall(
        caller('ipfs.swarm.addrs', opts),
        (res) => Promise.all(res.map(peerInfoFromJson))
      )
    ),
    localAddrs: callbackify(
      postCall(
        caller('ipfs.swarm.localAddrs', opts),
        (res) => res.map(multiaddrFromJson)
      )),
    connect: callbackify.variadic(
      preCall(
        (...args) => {
          if (isMultiaddr(args[0])) {
            args[0] = multiaddrToJson(args[0])
          }

          return args
        },
        caller('ipfs.swarm.connect', opts)
      )
    ),
    disconnect: callbackify.variadic(
      preCall(
        (...args) => {
          if (isMultiaddr(args[0])) {
            args[0] = multiaddrToJson(args[0])
          }

          return args
        },
        caller('ipfs.swarm.disconnect', opts)
      )
    )
  }
}
