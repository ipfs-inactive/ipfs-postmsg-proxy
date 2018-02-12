import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    rm: callbackify.variadic(caller('ipfs.files.rm', opts))
  }
}
