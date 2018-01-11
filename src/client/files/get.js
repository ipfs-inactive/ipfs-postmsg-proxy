import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import { pre, post } from 'prepost'
import { cidToJson, isCid } from '../../serialization/cid'
import { isBuffer, bufferToJson, bufferFromJson } from '../../serialization/buffer'

export default function (opts) {
  const api = {
    get: callbackify.variadic(
      pre(
        (...args) => {
          if (isBuffer(args[0])) {
            args[0] = bufferToJson(args[0])
          } else if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
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
    // FIXME: implement streams properly
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
    // FIXME: implement streams properly
    getPullStream () {
      const deferred = defer.source()

      api.get(...arguments)
        .then((files) => {
          files = files.map((file) => {
            if (file.content) {
              file.content = pull.values([file.content])
            }
            return file
          })
          deferred.resolve(pull.values(files))
        })
        .catch((err) => deferred.abort(err))

      return deferred
    }
  }

  return api
}
