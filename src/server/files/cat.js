import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import shortid from 'shortid'
import { preCidFromJson } from '../../serialization/cid'
import { isBuffer, preBufferFromJson, bufferToJson } from '../../serialization/buffer'
import { functionToJson } from '../../serialization/function'

export default function (getIpfs, opts) {
  return {
    cat: expose('ipfs.files.cat', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('files.cat'),
      post(
        (...args) => getIpfs().files.cat(...args),
        bufferToJson
      )
    ), opts),
    catPullStream: expose('ipfs.files.catPullStream', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('files.catPullStream'),
      post(
        (...args) => getIpfs().files.catPullStream(...args),
        (res) => new Promise((resolve) => {
          const readFnName = shortid()

          pull(
            res,
            PMS.sink(readFnName, Object.assign({}, opts, {
              post (res) {
                if (isBuffer(res.data)) {
                  res.data = bufferToJson(res.data)
                }

                return res
              }
            }))
          )

          resolve(functionToJson(readFnName))
        })
      )
    ), opts)
  }
}
