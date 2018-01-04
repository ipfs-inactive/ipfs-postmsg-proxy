import { expose } from 'postmsg-rpc'
import isTypedArray from 'is-typedarray'
import { preCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    publish: expose('ipfs.pubsub.publish', preCall(
      (...args) => {
        if (isTypedArray(args[1])) {
          args[1] = Buffer.from(args[1])
        }

        return args
      },
      (...args) => getIpfs().pubsub.publish(...args)
    ), opts),
    peers: expose('ipfs.pubsub.peers', () => getIpfs().pubsub.peers(), opts),
    ls: expose('ipfs.pubsub.ls', (...args) => getIpfs().pubsub.ls(...args), opts)
  }
}
