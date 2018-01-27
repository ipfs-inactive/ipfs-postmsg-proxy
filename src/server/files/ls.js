import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import shortid from 'shortid'
import { isCidJson, cidFromJson } from '../../serialization/cid'
import { isBufferJson, bufferFromJson } from '../../serialization/buffer'
import { functionToJson } from '../../serialization/function'

export default function (getIpfs, opts) {
  return {
    ls: expose('ipfs.files.ls', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.ls'],
      (...args) => getIpfs().ls(...args)
    ), opts),
    lsPullStream: expose('ipfs.files.lsPullStream', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['files.lsPullStream'],
      post(
        (...args) => getIpfs().lsPullStream(...args),
        (res) => new Promise(resolve => {
          const readFnName = shortid()
          pull(res, PMS.sink(readFnName, opts))
          resolve(functionToJson(readFnName))
        })
      )
    ), opts)
  }
}
