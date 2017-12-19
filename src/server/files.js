import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.files.add', preCall(
      (...args) => {
        // Structured clone converts Buffer to Uint8Array, convert back to buffer
        if (isTypedArray(args[0])) {
          args[0] = Buffer.from(args[0])
        }

        return args
      },
      (...args) => getIpfs().files.add(...args)
    ), opts),
    cat: expose('ipfs.files.cat', (...args) => getIpfs().files.cat(...args), opts),
    get: expose('ipfs.files.get', (...args) => getIpfs().files.get(...args), opts)
  }
}
