import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import PMS from 'pull-postmsg-stream'
import { pre, post } from 'prepost'
import { preCidToJson } from '../../serialization/cid'
import { isBufferJson, preBufferToJson, bufferFromJson } from '../../serialization/buffer'

export default function (opts) {
  const api = {
    get: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.files.get', opts),
          (files) => files.map((file) => {
            if (file.content) {
              file.content = bufferFromJson(file.content)
            }

            return file
          })
        )
      )
    ),
    getReadableStream () {
      return toStream.source(
        pull(
          api.getPullStream(...arguments),
          pull.map((file) => {
            if (file.content) {
              file.content = toStream.source(file.content)
            }
            return file
          })
        )
      )
    },
    getPullStream: (() => {
      const getPullStream = pre(
        preBufferToJson(0),
        preCidToJson(0),
        post(
          caller('ipfs.files.getPullStream', opts),
          (res) => pull(
            PMS.source(res.name, opts),
            pull.map((file) => {
              if (file.content) {
                file.content = PMS.source(file.content.name, Object.assign({}, opts, {
                  post (res) {
                    if (isBufferJson(res.data)) {
                      res.data = bufferFromJson(res.data)
                    }

                    return res
                  }
                }))
              }

              return file
            })
          )
        )
      )

      return (...args) => {
        const deferred = defer.source()

        getPullStream(...args)
          .then((res) => deferred.resolve(res))
          .catch((err) => deferred.abort(err))

        return deferred
      }
    })()
  }

  return api
}
