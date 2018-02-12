import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre } from 'prepost'
import { preBufferToJson } from '../../serialization/buffer'

export default function (opts) {
  return {
    write: callbackify.variadic(
      pre(
        preBufferToJson(1),
        caller('ipfs.files.write', opts)
      )
    )
  }
}
