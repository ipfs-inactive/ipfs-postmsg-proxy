import { expose } from 'postmsg-rpc'
import { isDagNodeJson, dagNodeToJson, dagNodeFromJson, dagLinkToJson, dagLinkFromJson } from '../serialization/dag'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'
import { preCall, postCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    new: expose('ipfs.object.new', preCall(
      opts.preCall['object.new'],
      postCall(
        (...args) => getIpfs().object.new(...args),
        dagNodeToJson
      )
    ), opts),
    put: expose('ipfs.object.put', preCall(
      (...args) => {
        if (isDagNodeJson(args[0])) {
          return dagNodeFromJson(args[0])
            .then((dagNode) => {
              args[0] = dagNode
              return args
            })
        } else if (args[0] && isBufferJson(args[0].Data)) {
          args[0].Data = bufferFromJson(args[0].Data)
        } else if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        }

        return args
      },
      opts.preCall['object.put'],
      postCall(
        (...args) => getIpfs().object.put(...args),
        dagNodeToJson
      )
    ), opts),
    get: expose('ipfs.object.get', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['object.get'],
      postCall(
        (...args) => getIpfs().object.get(...args),
        dagNodeToJson
      )
    ), opts),
    data: expose('ipfs.object.data', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['object.data'],
      (...args) => getIpfs().object.data(...args)
    ), opts),
    links: expose('ipfs.object.links', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['object.links'],
      postCall(
        (...args) => getIpfs().object.links(...args),
        (res) => res.map(dagLinkToJson)
      )
    ), opts),
    stat: expose('ipfs.object.stat', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['object.stat'],
      (...args) => getIpfs().object.stat(...args)
    ), opts),
    patch: {
      addLink: expose('ipfs.object.patch.addLink', preCall(
        (...args) => {
          if (isBufferJson(args[0])) {
            args[0] = bufferFromJson(args[0])
          } else if (isCidJson(args[0])) {
            args[0] = cidFromJson(args[0])
          }

          args[1] = dagLinkFromJson(args[1])

          return args
        },
        opts.preCall['object.patch.addLink'],
        postCall(
          (...args) => getIpfs().object.patch.addLink(...args),
          dagNodeToJson
        )
      ), opts),
      rmLink: expose('ipfs.object.patch.rmLink', preCall(
        (...args) => {
          if (isBufferJson(args[0])) {
            args[0] = bufferFromJson(args[0])
          } else if (isCidJson(args[0])) {
            args[0] = cidFromJson(args[0])
          }

          args[1] = dagLinkFromJson(args[1])

          return args
        },
        opts.preCall['object.patch.rmLink'],
        postCall(
          (...args) => getIpfs().object.patch.rmLink(...args),
          dagNodeToJson
        )
      ), opts),
      appendData: expose('ipfs.object.patch.appendData', preCall(
        (...args) => {
          if (isBufferJson(args[0])) {
            args[0] = bufferFromJson(args[0])
          } else if (isCidJson(args[0])) {
            args[0] = cidFromJson(args[0])
          }

          if (isBufferJson(args[1])) {
            args[1] = bufferFromJson(args[1])
          }

          return args
        },
        opts.preCall['object.patch.appendData'],
        postCall(
          (...args) => getIpfs().object.patch.appendData(...args),
          dagNodeToJson
        )
      ), opts),
      setData: expose('ipfs.object.patch.setData', preCall(
        (...args) => {
          if (isBufferJson(args[0])) {
            args[0] = bufferFromJson(args[0])
          } else if (isCidJson(args[0])) {
            args[0] = cidFromJson(args[0])
          }

          if (isBufferJson(args[1])) {
            args[1] = bufferFromJson(args[1])
          }

          return args
        },
        opts.preCall['object.patch.setData'],
        postCall(
          (...args) => getIpfs().object.patch.setData(...args),
          dagNodeToJson
        )
      ), opts)
    }
  }
}
