import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson, bufferToJson } from '../serialization/buffer'

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
