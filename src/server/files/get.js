import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { isCidJson, cidFromJson } from '../../serialization/cid'
import { isBufferJson, bufferFromJson, bufferToJson } from '../../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    get: expose('ipfs.files.get', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.get'],
      post(
        (...args) => getIpfs().files.get(...args),
        (files) => files.map((file) => {
          if (file.content) {
            file.content = bufferToJson(file.content)
          }

          return file
        })
      )
    ), opts)
  }
}
