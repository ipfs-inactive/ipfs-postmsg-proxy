import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { isBuffer, bufferToJson } from '../serialization/buffer'
import { preCall } from '../fn-call'

export default function (opts) {
  return {
    set: callbackify.variadic(
      preCall(
        (...args) => {
          if (isBuffer(args[1])) {
            args[1] = bufferToJson(args[1])
          }

          return args
        },
        caller('ipfs.config.set', opts)
      )
    ),
    get: callbackify.variadic(caller('ipfs.config.get', opts)),
    replace: callbackify.variadic(caller('ipfs.config.replace', opts))
  }
}
