import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    flush: expose('ipfs.files.flush', pre(
      opts.pre('files.flush'),
      (...args) => getIpfs().files.flush(...args)
    ), opts)
  }
}
