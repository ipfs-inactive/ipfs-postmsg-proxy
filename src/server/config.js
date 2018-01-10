import { expose } from 'postmsg-rpc'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    set: expose('ipfs.config.set', preCall(
      (...args) => {
        if (isBufferJson(args[1])) {
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
    ), opts),
    replace: expose('ipfs.config.replace', preCall(
      opts.preCall['config.replace'],
      (...args) => getIpfs().config.set(...args)
    ), opts)
  }
}
