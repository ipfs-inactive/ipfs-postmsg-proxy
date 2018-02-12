import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { post } from 'prepost'
import { bufferFromJson } from '../../serialization/buffer'

export default function (opts) {
  return {
    read: callbackify.variadic(
      post(
        caller('ipfs.files.read', opts),
        bufferFromJson
      )
    )
  }
}
