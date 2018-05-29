import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import shortid from 'shortid'
import { functionToJson } from '../serialization/function'

export default function (getIpfs, opts) {
  return {
    ping: expose('ipfs.ping', pre(
      opts.pre('ping'),
      (...args) => getIpfs().ping(...args)
    ), opts),
    pingPullStream: expose('ipfs.pingPullStream', pre(
      opts.pre('pingPullStream'),
      post(
        (...args) => getIpfs().pingPullStream(...args),
        (res) => new Promise((resolve) => {
          const readFnName = shortid()
          pull(res, PMS.sink(readFnName, opts))
          resolve(functionToJson(readFnName))
        })
      )
    ), opts)
  }
}
