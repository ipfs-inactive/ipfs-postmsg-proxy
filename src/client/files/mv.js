import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'

export default function (opts) {
  return {
    mv: callbackify.variadic(caller('ipfs.files.mv', opts))
  }
}
