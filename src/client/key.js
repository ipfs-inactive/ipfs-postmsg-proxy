import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    gen: callbackify.variadic(caller('ipfs.key.gen', opts)),
    list: callbackify(caller('ipfs.key.list', opts)),
    rename: callbackify.variadic(caller('ipfs.key.rename', opts)),
    rm: callbackify.variadic(caller('ipfs.key.rm', opts))
  }
}
