import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { peerIdFromJson, peerInfoToJson, isPeerIdJson, isPeerInfo } from '../serialization/peer'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.dht.put', pre(
      opts.pre['dht.put'],
      (...args) => getIpfs().dht.put(...args)
    ), opts),
    get: expose('ipfs.dht.get', pre(
      opts.pre['dht.get'],
      (...args) => getIpfs().dht.get(...args)
    ), opts),
    findprovs: expose('ipfs.dht.findprovs', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        }

        return args
      },
      opts.pre['dht.findprovs'],
      post(
        (...args) => getIpfs().dht.findprovs(...args),
        (res) => res.map((item) => isPeerInfo(item) ? peerInfoToJson(item) : item)
      )
    ), opts),
    findpeer: expose('ipfs.dht.findpeer', pre(
      (...args) => {
        if (isPeerIdJson(args[0])) {
          args[0] = peerIdFromJson(args[0])
        }

        return args
      },
      opts.pre['dht.findpeer'],
      post(
        (...args) => getIpfs().dht.findpeer(...args),
        (res) => isPeerInfo(res) ? peerInfoToJson(res) : res
      )
    ), opts),
    provide: expose('ipfs.dht.provide', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['dht.provide'],
      (...args) => getIpfs().dht.provide(...args)
    ), opts),
    query: expose('ipfs.dht.query', pre(
      (...args) => {
        if (isPeerIdJson(args[0])) {
          args[0] = peerIdFromJson(args[0])
        }

        return args
      },
      opts.pre['dht.query'],
      post(
        (...args) => getIpfs().dht.query(...args),
        (res) => res.map((item) => isPeerInfo(item) ? peerInfoToJson(item) : item)
      )
    ), opts)
  }
}
