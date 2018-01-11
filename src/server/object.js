import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { isDagNodeJson, dagNodeToJson, dagNodeFromJson, dagLinkToJson, dagLinkFromJson } from '../serialization/dag'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson, bufferToJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    new: expose('ipfs.object.new', pre(
      opts.pre['object.new'],
      post(
        (...args) => getIpfs().object.new(...args),
        dagNodeToJson
      )
    ), opts),
    put: expose('ipfs.object.put', pre(
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
      opts.pre['object.put'],
      post(
        (...args) => getIpfs().object.put(...args),
        dagNodeToJson
      )
    ), opts),
    get: expose('ipfs.object.get', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['object.get'],
      post(
        (...args) => getIpfs().object.get(...args),
        dagNodeToJson
      )
    ), opts),
    data: expose('ipfs.object.data', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['object.data'],
      post(
        (...args) => getIpfs().object.data(...args),
        bufferToJson
      )
    ), opts),
    links: expose('ipfs.object.links', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['object.links'],
      post(
        (...args) => getIpfs().object.links(...args),
        (res) => res.map(dagLinkToJson)
      )
    ), opts),
    stat: expose('ipfs.object.stat', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['object.stat'],
      (...args) => getIpfs().object.stat(...args)
    ), opts),
    patch: {
      addLink: expose('ipfs.object.patch.addLink', pre(
        (...args) => {
          if (isBufferJson(args[0])) {
            args[0] = bufferFromJson(args[0])
          } else if (isCidJson(args[0])) {
            args[0] = cidFromJson(args[0])
          }

          args[1] = dagLinkFromJson(args[1])

          return args
        },
        opts.pre['object.patch.addLink'],
        post(
          (...args) => getIpfs().object.patch.addLink(...args),
          dagNodeToJson
        )
      ), opts),
      rmLink: expose('ipfs.object.patch.rmLink', pre(
        (...args) => {
          if (isBufferJson(args[0])) {
            args[0] = bufferFromJson(args[0])
          } else if (isCidJson(args[0])) {
            args[0] = cidFromJson(args[0])
          }

          args[1] = dagLinkFromJson(args[1])

          return args
        },
        opts.pre['object.patch.rmLink'],
        post(
          (...args) => getIpfs().object.patch.rmLink(...args),
          dagNodeToJson
        )
      ), opts),
      appendData: expose('ipfs.object.patch.appendData', pre(
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
        opts.pre['object.patch.appendData'],
        post(
          (...args) => getIpfs().object.patch.appendData(...args),
          dagNodeToJson
        )
      ), opts),
      setData: expose('ipfs.object.patch.setData', pre(
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
        opts.pre['object.patch.setData'],
        post(
          (...args) => getIpfs().object.patch.setData(...args),
          dagNodeToJson
        )
      ), opts)
    }
  }
}
