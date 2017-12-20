import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import toPull from 'stream-to-pull-stream'
import isStream from 'is-stream'
import { preCall } from '../../fn-call'

export default function (opts) {
  const api = {
    add: callbackify.variadic(
      preCall(
        (...args) => {
          // TODO: handle progress
          if (args[1] && args[1].progress) {
            throw new Error('Not implemented')
          }

          // FIXME: implement streams properly
          // Buffer all the streaming data into memory
          return new Promise((resolve, reject) => {
            pull(
              pull.values(Array.isArray(args[0]) ? args[0] : [args[0]]),
              pull.map(normalizeContent),
              pull.asyncMap((file, cb) => {
                pull(
                  file.content,
                  pull.collect((err, buffers) => {
                    if (err) return cb(err)
                    cb(null, Object.assign(file, { content: Buffer.concat(buffers) }))
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
    addReadableStream: (opts) => toStream(api.addPullStream(opts)),
    addPullStream: (opts) => pull(
      pull.map((content) => Array.isArray(content) ? content : [content]),
      pull.map(normalizeContent),
      pull.flatten(),
      pull.asyncMap((content, cb) => api.add(content, opts, cb))
    )
  }

  return api
}

function normalizeContent (data) {
  if (Buffer.isBuffer(data)) {
    data = { path: '', content: pull.values([data]) }
  }

  if (isStream.readable(data)) {
    data = { path: '', content: toPull.source(data) }
  }

  if (data && data.content && typeof data.content !== 'function') {
    if (Buffer.isBuffer(data.content)) {
      data.content = pull.values([data.content])
    }

    if (isStream.readable(data.content)) {
      data.content = toPull.source(data.content)
    }
  }

  return data
}
