import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    publish: callbackify.variadic(caller('ipfs.pubsub.publish', opts)),
    // subscribe: callbackify.variadic(caller('ipfs.pubsub.subscribe', opts)),
    // unsubscribe: callbackify.variadic(caller('ipfs.pubsub.unsubscribe', opts)),
    peers: callbackify.variadic(caller('ipfs.pubsub.peers', opts)),
    ls: callbackify.variadic(caller('ipfs.pubsub.ls', opts))
  }
}
