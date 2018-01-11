import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { isDagNode, isDagNodeJson, dagNodeToJson, dagNodeFromJson, isDagLink, dagLinkToJson, dagLinkFromJson } from '../serialization/dag'
import { cidToJson, isCid } from '../serialization/cid'
import { isBuffer, bufferFromJson, bufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    new: callbackify.variadic(
      post(
        caller('ipfs.object.new', opts),
        (res) => isDagNodeJson(res) ? dagNodeFromJson(res) : res
      )
    ),
    put: callbackify.variadic(
      pre(
        (...args) => {
          if (isDagNode(args[0])) {
            args[0] = dagNodeToJson(args[0])
          } else if (args[0] && isBuffer(args[0].Data)) {
            args[0] = Object.assign({}, args[0], { Data: bufferToJson(args[0].Data) })
          } else if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.object.put', opts),
          (res) => isDagNodeJson(res) ? dagNodeFromJson(res) : res
        )
      )
    ),
    get: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.object.get', opts),
          (res) => isDagNodeJson(res) ? dagNodeFromJson(res) : res
        )
      )
    ),
    data: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.object.data', opts),
          bufferFromJson
        )
      )
    ),
    links: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        post(
          caller('ipfs.object.links', opts),
          (res) => res.map(dagLinkFromJson)
        )
      )
    ),
    stat: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        caller('ipfs.object.stat', opts)
      )
    ),
    patch: {
      addLink: callbackify.variadic(
        pre(
          (...args) => {
            if (isBuffer(args[0])) {
              args[0] = bufferToJson(args[0])
            } else if (isCid(args[0])) {
              args[0] = cidToJson(args[0])
            }

            if (isDagLink(args[1])) {
              args[1] = dagLinkToJson(args[1])
            }

            return args
          },
          post(
            caller('ipfs.object.patch.addLink', opts),
            dagNodeFromJson
          )
        )
      ),
      rmLink: callbackify.variadic(
        pre(
          (...args) => {
            if (isBuffer(args[0])) {
              args[0] = bufferToJson(args[0])
            } else if (isCid(args[0])) {
              args[0] = cidToJson(args[0])
            }

            if (isDagLink(args[1])) {
              args[1] = dagLinkToJson(args[1])
            }

            return args
          },
          post(
            caller('ipfs.object.patch.rmLink', opts),
            dagNodeFromJson
          )
        )
      ),
      appendData: callbackify.variadic(
        pre(
          (...args) => {
            if (isBuffer(args[0])) {
              args[0] = bufferToJson(args[0])
            } else if (isCid(args[0])) {
              args[0] = cidToJson(args[0])
            }

            return args
          },
          post(
            caller('ipfs.object.patch.appendData', opts),
            dagNodeFromJson
          )
        )
      ),
      setData: callbackify.variadic(
        pre(
          (...args) => {
            if (isBuffer(args[0])) {
              args[0] = bufferToJson(args[0])
            } else if (isCid(args[0])) {
              args[0] = cidToJson(args[0])
            }

            return args
          },
          post(
            caller('ipfs.object.patch.setData', opts),
            dagNodeFromJson
          )
        )
      )
    }
  }
}
