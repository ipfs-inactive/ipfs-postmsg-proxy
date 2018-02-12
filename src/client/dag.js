import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { isDagNodeJson, preDagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { cidFromJson, preCidToJson } from '../serialization/cid'
import { isBuffer, isBufferJson, preBufferToJson, bufferToJson, bufferFromJson } from '../serialization/buffer'
import convertValues from '../serialization/utils/convert-values'

export default function (opts) {
  return {
    put: callbackify.variadic(
      pre(
        preDagNodeToJson(0),
        (...args) => {
          if (args[0] && !isDagNodeJson(args[0])) {
            args[0] = convertValues(args[0], isBuffer, bufferToJson)
          }

          return args
        },
        post(
          caller('ipfs.dag.put', opts),
          cidFromJson
        )
      )
    ),
    get: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.dag.get', opts),
          (res) => {
            if (isDagNodeJson(res.value)) {
              return dagNodeFromJson(res.value).then((value) => ({ value }))
            }

            // TODO: CBOR node, is this correct?
            if (res.value) {
              res.value = convertValues(res.value, isBufferJson, bufferFromJson)
            }

            return res
          }
        )
      )
    ),
    tree: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        caller('ipfs.dag.tree', opts)
      )
    )
  }
}
