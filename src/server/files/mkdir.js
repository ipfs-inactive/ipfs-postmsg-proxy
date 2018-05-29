import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'

export default function (getIpfs, opts) {
  return {
    mkdir: expose('ipfs.files.mkdir', pre(
      opts.pre('files.mkdir'),
      post(
        (...args) => getIpfs().files.mkdir(...args),
        () => null
      )
    ), opts)
  }
}
