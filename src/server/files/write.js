import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'
import { preBufferFromJson } from '../../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    write: expose('ipfs.files.write', pre(
      preBufferFromJson(1),
      opts.pre('files.write'),
      (...args) => getIpfs().files.write(...args)
    ), opts)
  }
}
