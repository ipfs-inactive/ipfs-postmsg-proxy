import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import toStream from 'pull-stream-to-stream'
import PMS from 'pull-postmsg-stream'
import { post } from 'prepost'

export default function (opts) {
  const api = {
    ping: callbackify.variadic(caller('ipfs.ping', opts)),
    pingPullStream: (() => {
      const pingPullStream = post(
        caller('ipfs.pingPullStream', opts),
        (res) => PMS.source(res.name, opts)
      )

      return (...args) => {
        const deferred = defer.source()

        pingPullStream(...args)
          .then((res) => deferred.resolve(res))
          .catch((err) => deferred.abort(err))

        return deferred
      }
    })(),
    pingReadableStream () {
      return toStream.source(api.pingPullStream(...arguments))
    }
  }

  return api
}
