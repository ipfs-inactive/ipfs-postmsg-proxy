import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import shortid from 'shortid'
import { preCidFromJson } from '../serialization/cid'
import { preBufferFromJson } from '../serialization/buffer'
import { functionToJson } from '../serialization/function'

export default function (getIpfs, opts) {
  return {
    ls: expose('ipfs.ls', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('ls'),
      (...args) => getIpfs().ls(...args)
    ), opts),
    lsPullStream: expose('ipfs.lsPullStream', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('lsPullStream'),
      post(
        (...args) => getIpfs().lsPullStream(...args),
        (res) => new Promise((resolve) => {
          const readFnName = shortid()
          pull(res, PMS.sink(readFnName, opts))
          resolve(functionToJson(readFnName))
        })
      )
    ), opts)
  }
}
