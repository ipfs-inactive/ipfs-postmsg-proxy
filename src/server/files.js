import { expose } from 'postmsg-rpc'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.files.add', preCall(
      (...args) => {
        // Structured clone converts Buffer to Uint8Array, convert back to buffer
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
      opts.preCall['files.add'],
      (...args) => getIpfs().files.add(...args)
    ), opts),
    cat: expose('ipfs.files.cat', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['files.cat'],
      (...args) => getIpfs().files.cat(...args)
    ), opts),
    get: expose('ipfs.files.get', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['files.get'],
      (...args) => getIpfs().files.get(...args)
    ), opts),
    ls: expose('ipfs.files.ls', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['files.ls'],
      (...args) => getIpfs().ls(...args)
    ), opts)
  }
}
