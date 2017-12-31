import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { isDagNodeJson, isDagNode, dagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { isCidJson, cidToJson, cidFromJson } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'
import { convertTypedArraysToBuffers } from '../converters'

export default function (getIpfs, opts) {
  return {
    new: expose('ipfs.object.new', postCall(
      (...args) => getIpfs().object.new(...args),
      (res) => isDagNode(res) ? dagNodeToJson(res) : res
    ), opts),
    put: expose('ipfs.object.put', preCall(
      (...args) => {
        if (isDagNodeJson(args[0])) {
          return dagNodeFromJson(args[0])
            .then((dagNode) => {
              args[0] = dagNode
              return args
            })
        }

        return args
      },
      postCall(
        (...args) => getIpfs().object.put(...args),
        (res) => isDagNode(res) ? dagNodeToJson(res) : res
      )
    ), opts),
    get: expose('ipfs.object.get', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().object.get(...args),
        (res) => isDagNode(res) ? dagNodeToJson(res) : res
      )
    ), opts),
    data: expose('ipfs.object.data', (...args) => getIpfs().object.data(...args), opts),
    links: expose('ipfs.object.links', (...args) => getIpfs().object.links(...args), opts),
    stat: expose('ipfs.object.stat', (...args) => getIpfs().object.stat(...args), opts),
    patch: {
      addLink: expose('ipfs.object.patch.addLink', (...args) => getIpfs().object.patch.addLink(...args), opts),
      rmLink: expose('ipfs.object.patch.rmLink', (...args) => getIpfs().object.patch.rmLink(...args), opts),
      appendData: expose('ipfs.object.patch.appendData', (...args) => getIpfs().object.patch.appendData(...args), opts),
      setData: expose('ipfs.object.patch.setData', (...args) => getIpfs().object.patch.setData(...args), opts)
    }
  }
}
