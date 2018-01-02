import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    put: callbackify.variadic(caller('ipfs.dht.put', opts)),
    get: callbackify.variadic(caller('ipfs.dht.get', opts)),
    findprovs: callbackify.variadic(caller('ipfs.dht.findprovs', opts)),
    findpeer: callbackify.variadic(caller('ipfs.dht.findpeer', opts)),
    provide: callbackify.variadic(caller('ipfs.dht.provide', opts)),
    query: callbackify.variadic(caller('ipfs.dht.query', opts))
  }
}
