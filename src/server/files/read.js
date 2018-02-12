import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { bufferToJson } from '../../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    read: expose('ipfs.files.read', pre(
      opts.pre('files.read'),
      post(
        (...args) => getIpfs().files.read(...args),
        bufferToJson
      )
    ), opts)
  }
}
