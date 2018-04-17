import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { isDagNodeJson, preDagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { isCid, cidFromJson, cidToJson, preCidToJson } from '../serialization/cid'
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

          if (args[1] && args[1].cid) {
            if (isBuffer(args[1].cid)) {
              args[1].cid = bufferToJson(args[1].cid)
            } else if (isCid(args[1].cid)) {
              args[1].cid = cidToJson(args[1].cid)
            }
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

            if (isBufferJson(res.value)) {
              res.value = bufferFromJson(res.value)
            } else if (res.value) { // TODO: CBOR node, is this correct?
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
