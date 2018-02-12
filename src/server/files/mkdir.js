import { expose } from 'postmsg-rpc'

export default function (getIpfs, opts) {
  return {
    mkdir: expose('ipfs.files.mkdir', (...args) => getIpfs().files.mkdir(...args), opts)
  }
}
