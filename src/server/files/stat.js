import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    stat: expose('ipfs.files.stat', pre(
      opts.pre('files.stat'),
      (...args) => getIpfs().files.stat(...args)
    ), opts)
  }
}
