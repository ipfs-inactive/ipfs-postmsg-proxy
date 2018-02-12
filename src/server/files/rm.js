import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    rm: expose('ipfs.files.rm', pre(
      opts.pre('files.rm'),
      (...args) => getIpfs().files.rm(...args)
    ), opts)
  }
}
