import { expose } from 'postmsg-rpc'
import { isDagNodeJson, isDagNode, dagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { isCidJson, cidToJson, cidFromJson } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'
import { convertTypedArraysToBuffers } from '../converters'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.dag.put', preCall(
      (...args) => {
        if (isDagNodeJson(args[0])) {
          return dagNodeFromJson(args[0])
            .then((dagNode) => {
              args[0] = dagNode
              return args
            })
        }

        // TODO: CBOR node, is this correct?
        if (args[0]) {
          args[0] = convertTypedArraysToBuffers(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().dag.put(...args),
        cidToJson
      )
    ), opts),
    get: expose('ipfs.dag.get', preCall(
      (...args) => {
        if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().dag.get(...args),
        (res) => {
          res.value = isDagNode(res.value) ? dagNodeToJson(res.value) : res.value
          return res
        }
      )
    ), opts),
    tree: expose('ipfs.dag.tree', preCall(
      (...args) => {
        if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      (...args) => getIpfs().dag.tree(...args)
    ), opts)
  }
}