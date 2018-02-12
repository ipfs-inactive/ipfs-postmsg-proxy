import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    ls: expose('ipfs.files.ls', pre(
      opts.pre('files.ls'),
      (...args) => getIpfs().files.ls(...args)
    ), opts)
  }
}
