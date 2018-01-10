import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { Transform } from 'stream'
import pull from 'pull-stream'
import toPull from 'stream-to-pull-stream'
import isStream from 'is-stream'
import { isSource } from 'is-pull-stream'
import buffer from 'pull-buffer'
import { preCall } from '../../fn-call'
import { isBuffer, bufferToJson } from '../../serialization/buffer'

export default function (opts) {
  const api = {
    add: callbackify.variadic(
      preCall(
        (...args) => {
          let progressBytes = 0
          let onProgress

          // FIXME: implement progress properly
          if (args[1] && args[1].progress) {
            onProgress = args[1].progress
            delete args[1].progress
          }

          // FIXME: implement streams properly
          return new Promise((resolve, reject) => {
            pull(
              pull.values(Array.isArray(args[0]) ? args[0] : [args[0]]),
              pull.map(normalizeContent),
              pull.asyncMap((file, cb) => {
                if (!file.content) return cb(null, file)

                // Buffer all the streaming data into memory
                pull(
                  file.content,
                  pull.collect((err, buffers) => {
                    if (err) return cb(err)

                    const content = Buffer.concat(buffers)

                    if (onProgress) {
                      progressBytes += content.length
                      onProgress(progressBytes)
                    }

                    cb(null, Object.assign(file, { content: bufferToJson(content) }))
                  })
                )
              }),
              pull.collect((err, files) => {
                if (err) return reject(err)
                args[0] = files
                resolve(args)
              })
            )
          })
        },
        caller('ipfs.files.add', opts)
      )
    ),
    // FIXME: implement streams properly
    addReadableStream (...args) {
      const content = []
      return new Transform({
        objectMode: true,
        transform (chunk, enc, cb) {
          content.push(normalizeContent(chunk))
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
    // FIXME: implement streams properly
    addPullStream: (...args) => pull(
      buffer(),
      pull.map((data) => data.map(normalizeContent)),
      pull.asyncMap((content, cb) => api.add.apply(api, [content].concat(args, cb))),
      pull.flatten()
    )
  }

  return api
}

function normalizeContent (data) {
  if (isBuffer(data)) {  // Buffer
    return { path: '', content: pull.values([data]) }
  } else if (isStream.readable(data)) { // Node stream
    return { path: '', content: toPull.source(data) }
  } else if (isSource(data)) { // Pull stream
    return { path: '', content: data }
  } else if (data && data.content) { // Object { path?, content }
    return Object.assign({}, data, { content: normalizeContent(data.content).content })
  } else if (data && data.path) { // Object { path }
    return data
  }

  throw new Error('Invalid arguments, data must be an Array, Buffer, readable stream or source pull stream')
}
