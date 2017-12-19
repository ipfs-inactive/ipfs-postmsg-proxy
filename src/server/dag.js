import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { isDagNodeJson, dagNodeFromJson } from '../serialization/dag'
import { cidToJson } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'

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
        if (args[0] && args[0].data && isTypedArray(args[0].data)) {
          args[0].data = Buffer.from(args[0].data)
        }

        return args
      },
      postCall(
        (...args) => getIpfs().dag.put(...args),
        cidToJson
      )
    ), opts),
    get: expose('ipfs.dag.get', (...args) => getIpfs().dag.get(...args), opts),
    tree: expose('ipfs.dag.tree', (...args) => getIpfs().dag.tree(...args), opts)
  }
}
