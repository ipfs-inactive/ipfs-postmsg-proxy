import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'
import { preCidFromJson } from '../serialization/cid'
import { preBufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.pin.add', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('pin.add'),
      (...args) => getIpfs().pin.add(...args)
    ), opts),
    rm: expose('ipfs.pin.rm', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('pin.rm'),
      (...args) => getIpfs().pin.rm(...args)
    ), opts),
    ls: expose('ipfs.pin.ls', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('pin.ls'),
      (...args) => getIpfs().pin.ls(...args)
    ), opts)
  }
}
