import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { isDagNode, dagNodeToJson, preDagNodeFromJson } from '../serialization/dag'
import { cidToJson, preCidFromJson } from '../serialization/cid'
import { isBuffer, isBufferJson, bufferFromJson, preBufferFromJson, bufferToJson } from '../serialization/buffer'
import convertValues from '../serialization/utils/convert-values'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.dag.put', pre(
      preDagNodeFromJson(0),
      (...args) => {
        // TODO: CBOR node, is this correct?
        if (args[0] && !isDagNode(args[0])) {
          args[0] = convertValues(args[0], isBufferJson, bufferFromJson)
        }

        return args
      },
      opts.pre('dag.put'),
      post(
        (...args) => getIpfs().dag.put(...args),
        cidToJson
      )
    ), opts),
    get: expose('ipfs.dag.get', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('dag.get'),
      post(
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
    tree: expose('ipfs.dag.tree', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('dag.tree'),
      (...args) => getIpfs().dag.tree(...args)
    ), opts)
  }
}
