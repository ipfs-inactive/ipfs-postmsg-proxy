import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { isDagNode, isDagNodeJson, dagNodeToJson, dagNodeFromJson, dagLinkToJson, dagLinkFromJson } from '../serialization/dag'
import { cidToJson, isCid } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'

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
    data: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        postCall(
          caller('ipfs.object.data', opts),
          (res) => Buffer.from(res)
        )
      )
    ),
    links: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        postCall(
          caller('ipfs.object.links', opts),
          (res) => res.map(dagLinkFromJson)
        )
      )
    ),
    stat: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        caller('ipfs.object.stat', opts)
      )
    ),
    patch: {
      addLink: callbackify.variadic(
        preCall(
          (...args) => {
            if (isCid(args[0])) {
              args[0] = cidToJson(args[0])
            }

            args[1] = dagLinkToJson(args[1])

            return args
          },
          postCall(
            caller('ipfs.object.patch.addLink', opts),
            dagNodeFromJson
          )
        )
      ),
      rmLink: callbackify.variadic(
        preCall(
          (...args) => {
            if (isCid(args[0])) {
              args[0] = cidToJson(args[0])
            }

            console.log({'args[1]': args[1]})

            args[1] = dagLinkToJson(args[1])

            return args
          },
          postCall(
            caller('ipfs.object.patch.rmLink', opts),
            dagNodeFromJson
          )
        )),
      appendData: callbackify.variadic(caller('ipfs.object.patch.appendData', opts)),
      setData: callbackify.variadic(caller('ipfs.object.patch.setData', opts))
    }
  }
}
