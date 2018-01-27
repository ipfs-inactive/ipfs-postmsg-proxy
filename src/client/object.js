import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre, post } from 'prepost'
import { isDagNodeJson, preDagNodeToJson, dagNodeFromJson, preDagLinkToJson, dagLinkFromJson } from '../serialization/dag'
import { preCidToJson } from '../serialization/cid'
import { isBuffer, bufferFromJson, bufferToJson, preBufferToJson } from '../serialization/buffer'

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
        preDagNodeToJson(0),
        preBufferToJson(0),
        (...args) => {
          if (args[0] && isBuffer(args[0].Data)) {
            args[0] = Object.assign({}, args[0], { Data: bufferToJson(args[0].Data) })
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
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.object.get', opts),
          (res) => isDagNodeJson(res) ? dagNodeFromJson(res) : res
        )
      )
    ),
    data: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.object.data', opts),
          bufferFromJson
        )
      )
    ),
    links: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.object.links', opts),
          (res) => res.map(dagLinkFromJson)
        )
      )
    ),
    stat: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        caller('ipfs.object.stat', opts)
      )
    ),
    patch: {
      addLink: callbackify.variadic(
        pre(
          preBufferToJson(0),
          preCidToJson(0),
          preDagLinkToJson(1),
          post(
            caller('ipfs.object.patch.addLink', opts),
            dagNodeFromJson
          )
        )
      ),
      rmLink: callbackify.variadic(
        pre(
          preBufferToJson(0),
          preCidToJson(0),
          preDagLinkToJson(1),
          post(
            caller('ipfs.object.patch.rmLink', opts),
            dagNodeFromJson
          )
        )
      ),
      appendData: callbackify.variadic(
        pre(
          preBufferToJson(0),
          preCidToJson(0),
          preBufferToJson(1),
          post(
            caller('ipfs.object.patch.appendData', opts),
            dagNodeFromJson
          )
        )
      ),
      setData: callbackify.variadic(
        pre(
          preBufferToJson(0),
          preCidToJson(0),
          preBufferToJson(1),
          post(
            caller('ipfs.object.patch.setData', opts),
            dagNodeFromJson
          )
        )
      )
    }
  }
}
