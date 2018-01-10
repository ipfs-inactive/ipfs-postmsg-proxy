import { expose } from 'postmsg-rpc'
import { isDagNodeJson, isDagNode, dagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { isCidJson, cidToJson, cidFromJson } from '../serialization/cid'
import { isBuffer, isBufferJson, bufferFromJson, bufferToJson } from '../serialization/buffer'
import { preCall, postCall } from '../fn-call'
import { convertValues } from '../converters'

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
          args[0] = convertValues(args[0], isBufferJson, bufferFromJson)
        }

        return args
      },
      opts.preCall['dag.put'],
      postCall(
        (...args) => getIpfs().dag.put(...args),
        cidToJson
      )
    ), opts),
    get: expose('ipfs.dag.get', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['dag.get'],
      postCall(
        (...args) => getIpfs().dag.get(...args),
        (res) => {
          if (isDagNode(res.value)) {
            res.value = dagNodeToJson(res.value)
          } else {
            res.value = convertValues(res.value, isBuffer, bufferToJson)
          }

          return res
        }
      )
    ), opts),
    tree: expose('ipfs.dag.tree', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['dag.tree'],
      (...args) => getIpfs().dag.tree(...args)
    ), opts)
  }
}
