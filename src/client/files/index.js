import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import { preCall, postCall } from '../../fn-call'
import createFilesAdd from './add'

export default function (opts) {
  const api = Object.assign(
    createFilesAdd(opts),
    {
      cat: callbackify.variadic(
        postCall(
          caller('ipfs.files.cat', opts),
          (buf) => Buffer.from(buf)
        )
      ),
      // FIXME: implement streams properly
      catReadableStream () {
        const args = Array.from(arguments)
        return toStream.source(api.catPullStream(...args))
      },
      catPullStream () {
        const args = Array.from(arguments)
        return pull(
          pull.values([{}]),
          pull.asyncMap((_, cb) => api.cat(...args, cb))
        )
      },
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
  )

  return api
}
