import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { isDagNode, dagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { cidFromJson, cidToJson, isCid } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'

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
          dagNodeFromJson
        )
      )
    ),
    tree: callbackify.variadic(caller('ipfs.dag.tree', opts))
  }
}
