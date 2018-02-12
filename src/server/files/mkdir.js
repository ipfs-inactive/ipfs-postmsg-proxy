import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    mkdir: expose('ipfs.files.mkdir', pre(
      opts.pre('files.mkdir'),
      (...args) => getIpfs().files.mkdir(...args)
    ), opts)
  }
}
