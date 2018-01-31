import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import toStream from 'pull-stream-to-stream'
import PMS from 'pull-postmsg-stream'
import { pre, post } from 'prepost'
import { preCidToJson } from '../../serialization/cid'
import { isBufferJson, preBufferToJson, bufferFromJson } from '../../serialization/buffer'

export default function (opts) {
  const api = {
    cat: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.files.cat', opts),
          bufferFromJson
        )
      )
    ),
    catReadableStream () {
      return toStream.source(api.catPullStream(...arguments))
    },
    catPullStream: (() => {
      const catPullStream = pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.files.catPullStream', opts),
          (res) => PMS.source(res.name, Object.assign({}, opts, {
            post (res) {
              if (isBufferJson(res.data)) {
                res.data = bufferFromJson(res.data)
              }

              return res
            }
          }))
        )
      )

      return (...args) => {
        const deferred = defer.source()

        catPullStream(...args)
          .then((res) => deferred.resolve(res))
          .catch((err) => deferred.abort(err))

        return deferred
      }
    })()
  }

  return api
}
