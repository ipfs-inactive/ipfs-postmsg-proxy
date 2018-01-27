import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { preBlockToJson, blockFromJson } from '../serialization/block'
import { preCidToJson, cidToJson } from '../serialization/cid'
import { preBufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    put: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preBlockToJson(0),
        (...args) => {
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
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.block.get', opts),
          blockFromJson
        )
      )
    ),
    stat: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        caller('ipfs.block.stat', opts)
      )
    )
  }
}
