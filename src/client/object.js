import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { isDagNode, isDagNodeJson, dagNodeToJson, dagNodeFromJson } from '../serialization/dag'
import { cidFromJson, cidToJson, isCid } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'
import { convertTypedArraysToBuffers } from '../converters'

export default function (opts) {
  return {
    new: callbackify.variadic(
      postCall(
        caller('ipfs.object.new', opts),
        (res) => isDagNodeJson(res) ? dagNodeFromJson(res) : res
      )
    ),
    put: callbackify.variadic(
      preCall(
        (...args) => {
          if (isDagNode(args[0])) {
            args[0] = dagNodeToJson(args[0])
          }

          return args
        },
        postCall(
          caller('ipfs.object.put', opts),
          (res) => isDagNodeJson(res) ? dagNodeFromJson(res) : res
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
          caller('ipfs.object.get', opts),
          (res) => isDagNodeJson(res) ? dagNodeFromJson(res) : res
        )
      )
    ),
    data: callbackify.variadic(caller('ipfs.object.data', opts)),
    links: callbackify.variadic(caller('ipfs.object.links', opts)),
    stat: callbackify.variadic(caller('ipfs.object.stat', opts)),
    patch: {
      addLink: callbackify.variadic(caller('ipfs.object.patch.addLink', opts)),
      rmLink: callbackify.variadic(caller('ipfs.object.patch.rmLink', opts)),
      appendData: callbackify.variadic(caller('ipfs.object.patch.appendData', opts)),
      setData: callbackify.variadic(caller('ipfs.object.patch.setData', opts))
    }
  }
}
