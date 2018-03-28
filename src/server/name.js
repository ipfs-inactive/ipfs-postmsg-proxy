import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    publish: expose('ipfs.name.publish', pre(
      opts.pre('name.publish'),
      (...args) => getIpfs().name.publish(...args)
    ), opts),
    resolve: expose('ipfs.name.resolve', pre(
      opts.pre('name.resolve'),
      (...args) => getIpfs().name.resolve(...args)
    ), opts)
  }
}
