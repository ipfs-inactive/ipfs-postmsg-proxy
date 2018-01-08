import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.files.add', preCall(
      (...args) => {
        // Structured clone converts Buffer to Uint8Array, convert back to buffer
        if (Array.isArray(args[0])) {
          args[0] = args[0].map((c) => {
            if (isTypedArray(c.content)) {
              c.content = Buffer.from(c.content)
            }
            return c
          })
        } else if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isTypedArray(args[0].content)) {
          args[0].content = Buffer.from(args[0].content)
        }

        return args
      },
      opts.preCall['files.add'],
      (...args) => getIpfs().files.add(...args)
    ), opts),
    cat: expose('ipfs.files.cat', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
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
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
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
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
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
