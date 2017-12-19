import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import isTypedArray from 'is-typedarray'
import { preCall, postCall } from '../fn-call'

export default function (opts) {
  return {
    add: callbackify.variadic(
      preCall(
        (...args) => {
          if (isTypedArray(args[0])) {
            args[0] = Buffer.from(args[0])
          }

          // TODO: handle progress
          if (args[1] && args[1].progress) {
            throw new Error('Not implemented')
          }

          return args
        },
        caller('ipfs.files.add', opts)
      )
    ),
    addReadableStream: callbackify.variadic(
      preCall(
        () => { throw new Error('Not implemented') },
        caller('ipfs.files.addReadableStream', opts)
      )
    ),
    addPullStream: callbackify.variadic(
      preCall(
        () => { throw new Error('Not implemented') },
        caller('ipfs.files.addPullStream', opts)
      )
    ),
    cat: callbackify.variadic(
      postCall(
        caller('ipfs.files.cat', opts),
        (buf) => Buffer.from(buf)
      )
    ),
    catReadableStream: callbackify.variadic(
      preCall(
        () => { throw new Error('Not implemented') },
        caller('ipfs.files.catReadableStream', opts)
      )
    ),
    catPullStream: callbackify.variadic(
      preCall(
        () => { throw new Error('Not implemented') },
        caller('ipfs.files.catPullStream', opts)
      )
    ),
    get: callbackify.variadic(caller('ipfs.files.get', opts)),
    getReadableStream: callbackify.variadic(
      preCall(
        () => { throw new Error('Not implemented') },
        caller('ipfs.files.getReadableStream', opts)
      )
    ),
    getPullStream: callbackify.variadic(
      preCall(
        () => { throw new Error('Not implemented') },
        caller('ipfs.files.getPullStream', opts)
      )
    )
  }
}
