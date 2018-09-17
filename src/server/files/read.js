import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import shortid from 'shortid'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import { isBuffer, bufferToJson } from '../../serialization/buffer'
import { functionToJson } from '../../serialization/function'

export default function (getIpfs, opts) {
  return {
    read: expose('ipfs.files.read', pre(
      opts.pre('files.read'),
      post(
        (...args) => getIpfs().files.read(...args),
        bufferToJson
      )
    ), opts),
    readPullStream: expose('ipfs.files.readPullStream', pre(
      opts.pre('files.readPullStream'),
      post(
        (...args) => getIpfs().files.readPullStream(...args),
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
