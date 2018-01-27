import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre } from 'prepost'
import { preBufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    set: callbackify.variadic(
      pre(
        preBufferToJson(1),
        caller('ipfs.config.set', opts)
      )
    ),
    get: callbackify.variadic(caller('ipfs.config.get', opts)),
    replace: callbackify.variadic(caller('ipfs.config.replace', opts))
  }
}
