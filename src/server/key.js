import { expose } from 'postmsg-rpc'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    gen: expose('ipfs.key.gen', preCall(
      opts.preCall['key.gen'],
      (...args) => getIpfs().key.gen(...args)
    ), opts),
    list: expose('ipfs.key.list', preCall(
      opts.preCall['key.list'],
      () => getIpfs().key.list()
    ), opts),
    rename: expose('ipfs.key.rename', preCall(
      opts.preCall['key.rename'],
      (...args) => getIpfs().key.rename(...args)
    ), opts),
    rm: expose('ipfs.key.rm', preCall(
      opts.preCall['key.rm'],
      (...args) => getIpfs().key.rm(...args)
    ), opts)
  }
}
