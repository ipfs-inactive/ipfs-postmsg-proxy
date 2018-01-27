import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import { pre } from 'prepost'
import { preCidToJson } from '../../serialization/cid'
import { preBufferToJson } from '../../serialization/buffer'

export default function (opts) {
  const api = {
    ls: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
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
