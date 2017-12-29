import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import { preCall } from '../../fn-call'
import { cidToJson, isCid } from '../../serialization/cid'

export default function (opts) {
  const api = {
    ls: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }
          return args
        },
        caller('ipfs.files.ls', opts)
      )
    ),
    // FIXME: implement streams properly
    lsReadableStream () {
      return toStream.source(api.lsPullStream(...arguments))
    },
    // FIXME: implement streams properly
    lsPullStream () {
      const deferred = defer.source()

      api.ls(...arguments)
        .then((listing) => deferred.resolve(pull.values(listing)))
        .catch((err) => deferred.abort(err))

      return deferred
    }
  }

  return api
}
