import { expose } from 'postmsg-rpc'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.pin.add', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['pin.add'],
      (...args) => getIpfs().pin.add(...args)
    ), opts),
    rm: expose('ipfs.pin.rm', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['pin.rm'],
      (...args) => getIpfs().pin.rm(...args)
    ), opts),
    ls: expose('ipfs.pin.ls', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['pin.ls'],
      (...args) => getIpfs().pin.ls(...args)
    ), opts)
  }
}
