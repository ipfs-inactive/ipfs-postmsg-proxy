import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'

export default function (getIpfs, opts) {
  return {
    cp: expose('ipfs.files.cp', pre(
      opts.pre('files.cp'),
      post(
        (...args) => getIpfs().files.cp(...args),
        () => null
      )
    ), opts)
  }
}
