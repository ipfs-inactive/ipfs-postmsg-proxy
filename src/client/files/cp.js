import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    cp: callbackify.variadic(caller('ipfs.files.cp', opts))
  }
}
