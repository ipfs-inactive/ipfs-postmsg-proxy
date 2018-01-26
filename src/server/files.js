import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import shortid from 'shortid'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBuffer, isBufferJson, bufferFromJson, bufferToJson } from '../serialization/buffer'
import { functionToJson } from '../serialization/function'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.files.add', pre(
      (...args) => {
        if (Array.isArray(args[0])) {
          args[0] = args[0].map((c) => {
            if (isBufferJson(c.content)) {
              c.content = bufferFromJson(c.content)
            }
            return c
          })
        } else if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isBufferJson(args[0].content)) {
          args[0].content = bufferFromJson(args[0].content)
        }

        return args
      },
      opts.pre['files.add'],
      (...args) => getIpfs().files.add(...args)
    ), opts),
    cat: expose('ipfs.files.cat', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.cat'],
      post(
        (...args) => getIpfs().files.cat(...args),
        bufferToJson
      )
    ), opts),
    catPullStream: expose('ipfs.files.catPullStream', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.catPullStream'],
      post(
        (...args) => getIpfs().files.catPullStream(...args),
        (res) => new Promise(resolve => {
          const readFnName = shortid()

          pull(
            res,
            PMS.sink(readFnName, Object.assign({}, opts, {
              post: (res) => {
                if (isBuffer(res.data)) {
                  res.data = bufferToJson(res.data)
                }

                return res
              }
            }))
          )

          resolve(functionToJson(readFnName))
        })
      )
    ), opts),
    get: expose('ipfs.files.get', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.get'],
      post(
        (...args) => getIpfs().files.get(...args),
        (files) => files.map((file) => {
          if (file.content) {
            file.content = bufferToJson(file.content)
          }

          return file
        })
      )
    ), opts),
    ls: expose('ipfs.files.ls', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.ls'],
      (...args) => getIpfs().ls(...args)
    ), opts)
  }
}
