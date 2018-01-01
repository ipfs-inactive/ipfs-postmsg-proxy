import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    set: expose('ipfs.config.set', preCall(
      (...args) => {
        // Structured clone converts Buffer to Uint8Array, convert back to buffer
        args[0] = isTypedArray(args[0]) ? Buffer.from(args[0]) : args[0]

        if (args[1] && isTypedArray(args[1])) {
          args[1] = Buffer.from(args[1])
        }

        return args
      },
      (...args) => getIpfs().config.set(...args)
    ), opts),
    get: expose('ipfs.config.get', (...args) => getIpfs().config.get(...args), opts)
  }
}
