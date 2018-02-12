import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    ls: callbackify.variadic(caller('ipfs.files.ls', opts))
  }
}
