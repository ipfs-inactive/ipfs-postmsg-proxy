import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { blockToJson, blockFromJson, isBlock } from '../serialization/block'
import { cidToJson, isCid } from '../serialization/cid'
import { isBuffer, bufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    put: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isBlock(args[0])) {
            args[0] = blockToJson(args[0])
          }

          if (args[1] && args[1].cid) {
            args[1].cid = cidToJson(args[1].cid)
          }

          return args
        },
        post(
          caller('ipfs.block.put', opts),
          blockFromJson
        )
      )
    ),
    get: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.block.get', opts),
          blockFromJson
        )
      )
    ),
    stat: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }
          return args
        },
        caller('ipfs.block.stat', opts)
      )
    )
  }
}
