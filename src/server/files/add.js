import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import shortid from 'shortid'
import { isBufferJson, bufferFromJson } from '../../serialization/buffer'
import { isFunctionJson, functionToJson } from '../../serialization/function'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.files.add', pre(
      (...args) => {
        const fileFromJsonOpts = { pms: opts }

        args[0] = Array.isArray(args[0])
          ? args[0].map((file) => fileFromJson(file, fileFromJsonOpts))
          : fileFromJson(args[0], fileFromJsonOpts)

        return args
      },
      opts.pre('files.add'),
      (...args) => getIpfs().files.add(...args)
    ), opts),
    addPullStream: expose('ipfs.files.addPullStream', pre(
      opts.pre('files.addPullStream'),
      (...args) => {
        const readFnName = shortid()

        pull(
          PMS.source(args[0].name, opts),
          pull.map((obj) => fileFromJson(obj, { pms: opts })),
          getIpfs().files.addPullStream(...args.slice(1)),
          PMS.sink(readFnName, opts)
        )

        return functionToJson(readFnName)
      }
    ), opts)
  }
}

function fileFromJson (obj, opts) {
  opts = opts || {}

  if (isBufferJson(obj)) { // Buffer
    return bufferFromJson(obj)
  } else if (isFunctionJson(obj)) { // Pull stream
    return pullStreamFromJson(obj, opts)
  } else if (obj && obj.content) { // Object { path?, content }
    return Object.assign({}, obj, { content: fileFromJson(obj.content, opts) })
  }

  return obj // Object { path } maybe, but could be anything
}

function pullStreamFromJson (obj, opts) {
  opts = opts || {}

  return PMS.source(obj.name, Object.assign({}, opts.pms, {
    post (res) {
      if (isBufferJson(res.data)) {
        res.data = bufferFromJson(res.data)
      }

      return res
    }
  }))
}
