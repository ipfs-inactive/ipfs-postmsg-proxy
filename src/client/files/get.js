import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import defer from 'pull-defer'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import { preCall, postCall } from '../../fn-call'
import { cidToJson, isCid } from '../../serialization/cid'

export default function (opts) {
  const api = {
    get: callbackify.variadic(
      preCall(
        (...args) => {
          if (isCid(args[0])) {
            args[0] = cidToJson(args[0])
          }

          return args
        },
        postCall(
          caller('ipfs.files.get', opts),
          (files) => files.map((file) => {
            if (file.content) {
              file.content = Buffer.from(file.content)
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
