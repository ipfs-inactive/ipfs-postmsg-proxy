import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    mv: expose('ipfs.files.mv', pre(
      opts.pre('files.mv'),
      (...args) => getIpfs().files.mv(...args)
    ), opts)
  }
}
