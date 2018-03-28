import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    publish: callbackify.variadic(caller('ipfs.name.publish', opts)),
    resolve: callbackify.variadic(caller('ipfs.name.resolve', opts))
  }
}
