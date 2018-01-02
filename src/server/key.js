import { expose } from 'postmsg-rpc'

export default function (getIpfs, opts) {
  return {
    gen: expose('ipfs.key.gen', (...args) => getIpfs().key.gen(...args), opts),
    list: expose('ipfs.key.list', () => getIpfs().key.list(), opts),
    rename: expose('ipfs.key.rename', (...args) => getIpfs().key.rename(...args), opts),
    rm: expose('ipfs.key.rm', (...args) => getIpfs().key.rm(...args), opts)
  }
}
