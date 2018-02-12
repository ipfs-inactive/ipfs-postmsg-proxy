import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    stat: callbackify.variadic(caller('ipfs.files.stat', opts))
  }
}
