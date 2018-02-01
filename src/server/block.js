import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { blockToJson, preBlockFromJson } from '../serialization/block'
import { preCidFromJson, cidFromJson } from '../serialization/cid'
import { preBufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.block.put', pre(
      preBufferFromJson(0),
      preBlockFromJson(0),
      (...args) => {
        if (args[1] && args[1].cid) {
          args[1].cid = cidFromJson(args[1].cid)
        }

        return args
      },
      opts.pre('block.put'),
      post(
        (...args) => getIpfs().block.put(...args),
        blockToJson
      )
    ), opts),
    get: expose('ipfs.block.get', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('block.get'),
      post(
        (...args) => getIpfs().block.get(...args),
        blockToJson
      )
    ), opts),
    stat: expose('ipfs.block.stat', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('block.stat'),
      (...args) => getIpfs().block.stat(...args)
    ), opts)
  }
}
