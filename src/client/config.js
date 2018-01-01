import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    set: callbackify.variadic(caller('ipfs.config.set', opts)),
    get: callbackify.variadic(caller('ipfs.config.get', opts))
  }
}
