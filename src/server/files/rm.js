import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'

export default function (getIpfs, opts) {
  return {
    rm: expose('ipfs.files.rm', pre(
      opts.pre('files.rm'),
      post(
        (...args) => getIpfs().files.rm(...args),
        () => null
      )
    ), opts)
  }
}
