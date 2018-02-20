import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { preCidFromJson, preArrayOfCidFromJson } from '../serialization/cid'
import { prePeerIdFromJson, peerInfoToJson, isPeerInfo } from '../serialization/peer'
import { preBufferFromJson, preArrayOfBufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.dht.put', pre(
      opts.pre('dht.put'),
      (...args) => getIpfs().dht.put(...args)
    ), opts),
    get: expose('ipfs.dht.get', pre(
      opts.pre('dht.get'),
      (...args) => getIpfs().dht.get(...args)
    ), opts),
    findprovs: expose('ipfs.dht.findprovs', pre(
      preBufferFromJson(0),
      opts.pre('dht.findprovs'),
      post(
        (...args) => getIpfs().dht.findprovs(...args),
        (res) => res.map((item) => isPeerInfo(item) ? peerInfoToJson(item) : item)
      )
    ), opts),
    findpeer: expose('ipfs.dht.findpeer', pre(
      prePeerIdFromJson(0),
      opts.pre('dht.findpeer'),
      post(
        (...args) => getIpfs().dht.findpeer(...args),
        (res) => isPeerInfo(res) ? peerInfoToJson(res) : res
      )
    ), opts),
    provide: expose('ipfs.dht.provide', pre(
      preBufferFromJson(0),
      preArrayOfBufferFromJson(0),
      preCidFromJson(0),
      preArrayOfCidFromJson(0),
      opts.pre('dht.provide'),
      post(
        (...args) => getIpfs().dht.provide(...args),
        // js-ipfs returns undefined
        // js-ipfs-api -> go-ipfs returns the request stream, with no data
        //
        // https://ipfs.io/docs/api/#api-v0-dht-provide
        // ^ Docs say some response should be sent, but nothing is returned in
        // current implementations.
        //
        // Returning null here so structured clone doesn't error trying to clone
        // a stream.
        () => null
      )
    ), opts),
    query: expose('ipfs.dht.query', pre(
      prePeerIdFromJson(0),
      opts.pre('dht.query'),
      post(
        (...args) => getIpfs().dht.query(...args),
        (res) => res.map((item) => isPeerInfo(item) ? peerInfoToJson(item) : item)
      )
    ), opts)
  }
}
