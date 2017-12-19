import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { isDagNode, isDagNodeJson, dagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { cidFromJson, cidToJson, isCid } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'
import { convertTypedArraysToBuffers } from '../converters'

export default function (opts) {
  return {
    put: callbackify.variadic(
      preCall(
        (...args) => {
          if (isDagNode(args[0])) {
            args[0] = dagNodeToJson(args[0])
          }

          return args
        },
        postCall(
          caller('ipfs.dag.put', opts),
          cidFromJson
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
          caller('ipfs.dag.get', opts),
          (res) => {
            if (isDagNodeJson(res.value)) {
              return dagNodeFromJson(res.value).then((value) => ({ value }))
            }

            // TODO: CBOR node, is this correct?
            if (res.value) {
              res.value = convertTypedArraysToBuffers(res.value)
            }

            return res
          }
        )
      )
    ),
    tree: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        caller('ipfs.dag.tree', opts)
      )
    )
  }
}
