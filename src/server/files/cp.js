import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    cp: expose('ipfs.files.cp', pre(
      opts.pre('files.cp'),
      (...args) => getIpfs().files.mkdir(...args)
    ), opts)
  }
}
