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
    get: expose('ipfs.files.get', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('files.get'),
      post(
        (...args) => getIpfs().files.get(...args),
        (files) => files.map((file) => {
          if (file.content) {
            file.content = bufferToJson(file.content)
          }

          return file
        })
      )
    ), opts),
    getPullStream: expose('ipfs.files.getPullStream', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('files.getPullStream'),
      post(
        (...args) => getIpfs().files.getPullStream(...args),
        (res) => new Promise((resolve) => {
          const readFnName = shortid()

          pull(
            res,
            pull.map((file) => {
              if (file.content) {
                const readFnName = shortid()

                pull(
                  file.content,
                  PMS.sink(readFnName, Object.assign({}, opts, {
                    post (res) {
                      if (isBuffer(res.data)) {
                        res.data = bufferToJson(res.data)
                      }

                      return res
                    }
                  }))
                )

                file.content = functionToJson(readFnName)
              }

              return file
            }),
            PMS.sink(readFnName, opts)
          )

          resolve(functionToJson(readFnName))
        })
      )
    ), opts)
  }
}
