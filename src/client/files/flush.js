import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    flush: callbackify.variadic(caller('ipfs.files.flush', opts))
  }
}
