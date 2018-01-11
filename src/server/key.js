import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'

export default function (getIpfs, opts) {
  return {
    gen: expose('ipfs.key.gen', pre(
      opts.pre['key.gen'],
      (...args) => getIpfs().key.gen(...args)
    ), opts),
    list: expose('ipfs.key.list', pre(
      opts.pre['key.list'],
      () => getIpfs().key.list()
    ), opts),
    rename: expose('ipfs.key.rename', pre(
      opts.pre['key.rename'],
      (...args) => getIpfs().key.rename(...args)
    ), opts),
    rm: expose('ipfs.key.rm', pre(
      opts.pre['key.rm'],
      (...args) => getIpfs().key.rm(...args)
    ), opts)
  }
}
