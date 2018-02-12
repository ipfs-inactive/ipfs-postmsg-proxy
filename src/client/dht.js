import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { preCidToJson, preArrayOfCidToJson } from '../serialization/cid'
import { prePeerIdToJson, peerInfoFromJson, isPeerInfo } from '../serialization/peer'
import { preBufferToJson, preArrayOfBufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    put: callbackify.variadic(caller('ipfs.dht.put', opts)),
    get: callbackify.variadic(caller('ipfs.dht.get', opts)),
    findprovs: callbackify.variadic(
      pre(
        preBufferToJson(0),
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
        prePeerIdToJson(0),
        post(
          caller('ipfs.dht.findpeer', opts),
          (res) => isPeerInfo(res) ? peerInfoFromJson(res) : res
        )
      )
    ),
    provide: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preArrayOfBufferToJson(0),
        preCidToJson(0),
        preArrayOfCidToJson(0),
        caller('ipfs.dht.provide', opts)
      )
    ),
    query: callbackify.variadic(
      pre(
        prePeerIdToJson(0),
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
