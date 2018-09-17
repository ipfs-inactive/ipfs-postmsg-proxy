import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import PMS from 'pull-postmsg-stream'
import toStream from 'pull-stream-to-stream'
import { post } from 'prepost'
import { isBufferJson, bufferFromJson } from '../../serialization/buffer'

export default function (opts) {
  const api = {
    read: callbackify.variadic(
      post(
        caller('ipfs.files.read', opts),
        bufferFromJson
      )
    ),
    readReadableStream () {
      return toStream.source(api.readPullStream(...arguments))
    },
    readPullStream: (() => {
      const readPullStream = post(
        caller('ipfs.files.readPullStream', opts),
        (res) => PMS.source(res.name, Object.assign({}, opts, {
          post (res) {
            if (isBufferJson(res.data)) {
              res.data = bufferFromJson(res.data)
            }

            return res
          }
        }))
      )

      return (...args) => {
        const deferred = defer.source()

        readPullStream(...args)
          .then((res) => deferred.resolve(res))
          .catch((err) => deferred.abort(err))

        return deferred
      }
    })()
  }

  return api
}
