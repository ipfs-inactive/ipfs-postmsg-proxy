import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { isDagNodeJson, dagNodeToJson, dagNodeFromJson, dagLinkToJson } from '../serialization/dag'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { preCall, postCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    new: expose('ipfs.object.new', postCall(
      (...args) => getIpfs().object.new(...args),
      dagNodeToJson
    ), opts),
    put: expose('ipfs.object.put', preCall(
      (...args) => {
        if (isDagNodeJson(args[0])) {
          return dagNodeFromJson(args[0])
            .then((dagNode) => {
              args[0] = dagNode
              return args
            })
        } else if (args[0] && isTypedArray(args[0].Data)) {
          args[0].Data = Buffer.from(args[0].Data)
        } else if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().object.put(...args),
        dagNodeToJson
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
        dagNodeToJson
      )
    ), opts),
    data: expose('ipfs.object.data', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      (...args) => getIpfs().object.data(...args)
    ), opts),
    links: expose('ipfs.object.links', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      postCall(
        (...args) => getIpfs().object.links(...args),
        (res) => res.map(dagLinkToJson)
      )
    ), opts),
    stat: expose('ipfs.object.stat', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      (...args) => getIpfs().object.stat(...args)
    ), opts),
    patch: {
      addLink: expose('ipfs.object.patch.addLink', (...args) => getIpfs().object.patch.addLink(...args), opts),
      rmLink: expose('ipfs.object.patch.rmLink', (...args) => getIpfs().object.patch.rmLink(...args), opts),
      appendData: expose('ipfs.object.patch.appendData', (...args) => getIpfs().object.patch.appendData(...args), opts),
      setData: expose('ipfs.object.patch.setData', (...args) => getIpfs().object.patch.setData(...args), opts)
    }
  }
}
