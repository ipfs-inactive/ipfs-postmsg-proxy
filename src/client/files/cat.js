import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import pull from 'pull-stream'
import toStream from 'pull-stream-to-stream'
import { pre, post } from 'prepost'
import { preCidToJson } from '../../serialization/cid'
import { preBufferToJson, bufferFromJson } from '../../serialization/buffer'

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
    // FIXME: implement streams properly
    catReadableStream () {
      return toStream.source(api.catPullStream(...arguments))
    },
    catPullStream () {
      const args = Array.from(arguments)
      return pull(
        pull.values([{}]),
        pull.asyncMap((_, cb) => api.cat(...args, cb))
      )
    }
  }

  return api
}
