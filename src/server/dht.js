import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { peerIdFromJson, peerInfoToJson, isPeerIdJson, isPeerInfo } from '../serialization/peer'
import { preCall, postCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.dht.put', (...args) => getIpfs().dht.put(...args), opts),
    get: expose('ipfs.dht.get', (...args) => getIpfs().dht.get(...args), opts),
    findprovs: expose('ipfs.dht.findprovs', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().dht.findprovs(...args),
        (res) => res.map((item) => isPeerInfo(item) ? peerInfoToJson(item) : item)
      )
    ), opts),
    findpeer: expose('ipfs.dht.findpeer', preCall(
      (...args) => {
        if (isPeerIdJson(args[0])) {
          args[0] = peerIdFromJson(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().dht.findpeer(...args),
        (res) => isPeerInfo(res) ? peerInfoToJson(res) : res
      )
    ), opts),
    provide: expose('ipfs.dht.provide', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      (...args) => getIpfs().dht.provide(...args)
    ), opts),
    query: expose('ipfs.dht.query', preCall(
      (...args) => {
        if (isPeerIdJson(args[0])) {
          args[0] = peerIdFromJson(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().dht.query(...args),
        (res) => res.map((item) => isPeerInfo(item) ? peerInfoToJson(item) : item)
      )
    ), opts)
  }
}
