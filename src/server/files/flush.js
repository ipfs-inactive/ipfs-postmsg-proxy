import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'

export default function (getIpfs, opts) {
  return {
    flush: expose('ipfs.files.flush', pre(
      opts.pre('files.flush'),
      post(
        (...args) => getIpfs().files.flush(...args),
        () => null
      )
    ), opts)
  }
}
