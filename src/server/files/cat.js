import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import shortid from 'shortid'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBuffer, isBufferJson, bufferFromJson, bufferToJson } from '../serialization/buffer'
import { functionToJson } from '../serialization/function'

export default function (getIpfs, opts) {
  return {
    cat: expose('ipfs.files.cat', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.cat'],
      post(
        (...args) => getIpfs().files.cat(...args),
        bufferToJson
      )
    ), opts),
    catPullStream: expose('ipfs.files.catPullStream', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.catPullStream'],
      post(
        (...args) => getIpfs().files.catPullStream(...args),
        (res) => new Promise(resolve => {
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
