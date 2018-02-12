import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    mkdir: callbackify.variadic(caller('ipfs.files.mkdir', opts))
  }
}
