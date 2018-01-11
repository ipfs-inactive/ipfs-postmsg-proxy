import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.pin.add', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['pin.add'],
      (...args) => getIpfs().pin.add(...args)
    ), opts),
    rm: expose('ipfs.pin.rm', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['pin.rm'],
      (...args) => getIpfs().pin.rm(...args)
    ), opts),
    ls: expose('ipfs.pin.ls', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['pin.ls'],
      (...args) => getIpfs().pin.ls(...args)
    ), opts)
  }
}
