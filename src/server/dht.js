import { expose } from 'postmsg-rpc'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.dht.put', (...args) => getIpfs().dht.put(...args), opts),
    get: expose('ipfs.dht.get', (...args) => getIpfs().dht.get(...args), opts),
    findprovs: expose('ipfs.dht.findprovs', (...args) => getIpfs().dht.findprovs(...args), opts),
    findpeer: expose('ipfs.dht.findpeer', (...args) => getIpfs().dht.findpeer(...args), opts),
    provide: expose('ipfs.dht.provide', (...args) => getIpfs().dht.provide(...args), opts),
    query: expose('ipfs.dht.query', (...args) => getIpfs().dht.query(...args), opts)
  }
}
