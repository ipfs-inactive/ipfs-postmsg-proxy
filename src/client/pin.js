import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { cidToJson, isCid } from '../serialization/cid'
import { isBuffer, bufferToJson } from '../serialization/buffer'
import { preCall } from '../fn-call'

export default function (opts) {
  return {
    add: callbackify.variadic(
      preCall(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        caller('ipfs.pin.add', opts)
      )
    ),
    rm: callbackify.variadic(
      preCall(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        caller('ipfs.pin.rm', opts)
      )
    ),
    ls: callbackify.variadic(
      preCall(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        caller('ipfs.pin.ls', opts)
      )
    )
  }
}
