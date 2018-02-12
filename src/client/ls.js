import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import toStream from 'pull-stream-to-stream'
import PMS from 'pull-postmsg-stream'
import { pre, post } from 'prepost'
import { preCidToJson } from '../serialization/cid'
import { preBufferToJson } from '../serialization/buffer'

export default function (opts) {
  const api = {
    ls: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        caller('ipfs.ls', opts)
      )
    ),
    lsReadableStream () {
      return toStream.source(api.lsPullStream(...arguments))
    },
    lsPullStream: (() => {
      const lsPullStream = pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.lsPullStream', opts),
          (res) => PMS.source(res.name, opts)
        )
      )

      return (...args) => {
        const deferred = defer.source()

        lsPullStream(...args)
          .then((res) => deferred.resolve(res))
          .catch((err) => deferred.abort(err))

        return deferred
      }
    })()
  }

  return api
}
