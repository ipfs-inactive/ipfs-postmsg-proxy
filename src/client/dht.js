import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { cidToJson, isCid } from '../serialization/cid'
import { peerIdToJson, peerInfoFromJson, isPeerId, isPeerInfo } from '../serialization/peer'
import { isBuffer, bufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    put: callbackify.variadic(caller('ipfs.dht.put', opts)),
    get: callbackify.variadic(caller('ipfs.dht.get', opts)),
    findprovs: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.dht.findprovs', opts),
          (res) => Promise.all(
            res.map((item) => isPeerInfo(item) ? peerInfoFromJson(item) : Promise.resolve(item))
          )
        )
      )
    ),
    findpeer: callbackify.variadic(
      pre(
        (...args) => {
          if (isPeerId(args[0])) {
            args[0] = peerIdToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.dht.findpeer', opts),
          (res) => isPeerInfo(res) ? peerInfoFromJson(res) : res
        )
      )
    ),
    provide: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        caller('ipfs.dht.provide', opts)
      )
    ),
    query: callbackify.variadic(
      pre(
        (...args) => {
          if (isPeerId(args[0])) {
            args[0] = peerIdToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.dht.query', opts),
          (res) => Promise.all(
            res.map((item) => isPeerInfo(item) ? peerInfoFromJson(item) : Promise.resolve(item))
          )
        )
      )
    )
  }
}
