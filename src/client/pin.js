import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { pre } from 'prepost'
import { preCidToJson } from '../serialization/cid'
import { preBufferToJson } from '../serialization/buffer'

export default function (opts) {
  return {
    add: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        caller('ipfs.pin.add', opts)
      )
    ),
    rm: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        caller('ipfs.pin.rm', opts)
      )
    ),
    ls: callbackify.variadic(
      pre(
        preBufferToJson(0),
        preCidToJson(0),
        caller('ipfs.pin.ls', opts)
      )
    )
  }
}
