import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'

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
    ), opts)
  }
}
