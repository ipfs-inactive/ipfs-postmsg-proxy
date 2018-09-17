import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    export: callbackify.variadic(caller('ipfs.key.export', opts)),
    gen: callbackify.variadic(caller('ipfs.key.gen', opts)),
    import: callbackify.variadic(caller('ipfs.key.import', opts)),
    list: callbackify(caller('ipfs.key.list', opts)),
    rename: callbackify.variadic(caller('ipfs.key.rename', opts)),
    rm: callbackify.variadic(caller('ipfs.key.rm', opts))
  }
}
