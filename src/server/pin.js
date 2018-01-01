import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.pin.add', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      (...args) => getIpfs().pin.add(...args)
    ), opts),
    rm: expose('ipfs.pin.rm', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      (...args) => getIpfs().pin.rm(...args)
    ), opts),
    ls: expose('ipfs.pin.ls', preCall(
      (...args) => {
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      (...args) => getIpfs().pin.ls(...args)
    ), opts)
  }
}
