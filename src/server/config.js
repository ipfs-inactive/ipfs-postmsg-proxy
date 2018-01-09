import { expose } from 'postmsg-rpc'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    set: expose('ipfs.config.set', preCall(
      (...args) => {
        // Structured clone converts Buffer to Uint8Array, convert back to buffer
        args[0] = isBufferJson(args[0]) ? bufferFromJson(args[0]) : args[0]

        if (args[1] && isBufferJson(args[1])) {
          args[1] = bufferFromJson(args[1])
        }

        return args
      },
      opts.preCall['config.set'],
      (...args) => getIpfs().config.set(...args)
    ), opts),
    get: expose('ipfs.config.get', preCall(
      opts.preCall['config.get'],
      (...args) => getIpfs().config.get(...args)
    ), opts)
  }
}
