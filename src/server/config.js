import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'
import { preBufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    set: expose('ipfs.config.set', pre(
      preBufferFromJson(1),
      opts.pre('config.set'),
      (...args) => getIpfs().config.set(...args)
    ), opts),
    get: expose('ipfs.config.get', pre(
      opts.pre('config.get'),
      (...args) => getIpfs().config.get(...args)
    ), opts),
    replace: expose('ipfs.config.replace', pre(
      opts.pre('config.replace'),
      (...args) => getIpfs().config.set(...args)
    ), opts)
  }
}
