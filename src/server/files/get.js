import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { preCidFromJson } from '../../serialization/cid'
import { preBufferFromJson, bufferToJson } from '../../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    get: expose('ipfs.files.get', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
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
