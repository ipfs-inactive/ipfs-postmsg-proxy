import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { blockToJson, blockFromJson, isBlock } from '../serialization/block'
import { cidToJson, isCid } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'

export default function (opts) {
  return {
    put: callbackify.variadic(
      preCall(
        (...args) => {
          if (isBlock(args[0])) {
            args[0] = blockToJson(args[0])
          }
          if (args[1] && args[1].cid) {
            args[1].cid = cidToJson(args[1].cid)
          }
          return args
        },
        postCall(
          caller('ipfs.block.put', opts),
          blockFromJson
        )
      )
    ),
    get: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }
          return args
        },
        postCall(
          caller('ipfs.block.get', opts),
          blockFromJson
        )
      )
    ),
    stat: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }
          return args
        },
        caller('ipfs.block.stat', opts)
      )
    )
  }
}
