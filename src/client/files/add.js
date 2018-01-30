import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { Transform } from 'stream'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import toPull from 'stream-to-pull-stream'
import isStream from 'is-stream'
import { isSource } from 'is-pull-stream'
import shortid from 'shortid'
import { pre } from 'prepost'
import defer from 'pull-defer'
import abort from 'pull-abortable'
import { isBuffer, bufferToJson } from '../../serialization/buffer'
import { functionToJson } from '../../serialization/function'

export default function (opts) {
  const api = {
    add: callbackify.variadic(
      pre(
        (...args) => {
          const fileToJsonOpts = { pms: opts }

          // FIXME: implement progress properly
          if (args[1] && args[1].progress) {
            fileToJsonOpts.onProgressIncrement = createOnProgressIncrement(args[1].progress)
            delete args[1].progress
          }

          args[0] = Array.isArray(args[0])
            ? args[0].map(file => fileToJson(file, fileToJsonOpts))
            : fileToJson(args[0], fileToJsonOpts)

          return args
        },
        caller('ipfs.files.add', opts)
      )
    ),
    // FIXME: implement add readable stream properly
    addReadableStream (...args) {
      const content = []
      return new Transform({
        objectMode: true,
        transform (file, enc, cb) {
          content.push(file)
          cb()
        },
        flush (cb) {
          api.add.apply(api, [content].concat(args, (err, res) => {
            if (err) return cb(err)
            res.forEach((file) => this.push(file))
            cb()
          }))
        }
      })
    },
    addPullStream: (() => {
      const addPullStream = caller('ipfs.files.addPullStream', opts)

      return (...args) => {
        const deferred = defer.through()
        const abortable = abort()
        const fileToJsonOpts = { pms: opts }

        // FIXME: implement progress properly
        if (args[0] && args[0].progress) {
          fileToJsonOpts.onProgressIncrement = createOnProgressIncrement(args[0].progress)
          delete args[0].progress
        }

        addPullStream(...args)
          .then((res) => {
            const through = function (read) {
              PMS.sink(res.source.name, opts)(read)
              return PMS.source(res.sink.name, opts)
            }

            deferred.resolve(through)
          })
          .catch((err) => abortable.abort(err))

        return pull(
          pull.map(file => fileToJson(file, fileToJsonOpts)),
          deferred,
          abortable
        )
      }
    })()
  }

  return api
}

function createOnProgressIncrement (onProgress) {
  let bytes = 0
  return (incrementBytes) => {
    bytes += incrementBytes
    onProgress(bytes)
    return bytes
  }
}

function fileToJson (file, opts) {
  opts = opts || {}

  if (isBuffer(file)) { // Buffer
    if (opts.onProgressIncrement) opts.onProgressIncrement(file.length)
    return bufferToJson(file)
  } else if (isStream.readable(file)) { // Node stream
    return pullStreamToJson(toPull.source(file), opts)
  } else if (isSource(file)) { // Pull stream
    return pullStreamToJson(file, opts)
  } else if (file && file.content) { // Object { path?, content }
    return Object.assign({}, file, { content: fileToJson(file.content, opts) })
  } else if (file && file.path) { // Object { path }
    return file
  }

  throw new Error('Invalid arguments, must be an Array, Buffer, readable stream or source pull stream')
}

const pullStreamToJson = (source, opts) => {
  opts = opts || {}
  const readFnName = shortid()

  pull(
    source,
    PMS.sink(readFnName, Object.assign({}, opts.pms, {
      post (res) {
        if (isBuffer(res.data)) {
          if (opts.onProgressIncrement) opts.onProgressIncrement(res.data.length)
          res.data = bufferToJson(res.data)
        }

        return res
      }
    }))
  )

  return functionToJson(readFnName)
}
