import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import { postCall } from '../../fn-call'

export default function (opts) {
  const api = {
    cat: callbackify.variadic(
      postCall(
        caller('ipfs.files.cat', opts),
        (buf) => Buffer.from(buf)
      )
    ),
    // FIXME: implement streams properly
    catReadableStream () {
      return toStream.source(api.catPullStream(...arguments))
    },
    catPullStream () {
      const args = Array.from(arguments)
      return pull(
        pull.values([{}]),
        pull.asyncMap((_, cb) => api.cat(...args, cb))
      )
    }
  }

  return api
}
