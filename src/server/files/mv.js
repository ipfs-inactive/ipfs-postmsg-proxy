import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'

export default function (getIpfs, opts) {
  return {
    mv: expose('ipfs.files.mv', pre(
      opts.pre('files.mv'),
      post(
        (...args) => getIpfs().files.mv(...args),
        () => null
      )
    ), opts)
  }
}
