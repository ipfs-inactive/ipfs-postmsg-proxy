import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { blockToJson, blockFromJson, isBlockJson } from '../serialization/block'
import { cidFromJson, isCidJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.block.put', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isBlockJson(args[0])) {
          // otherwise this must be a serialized Block
          args[0] = blockFromJson(args[0])
        }

        if (args[1] && args[1].cid) {
          args[1].cid = cidFromJson(args[1].cid)
        }

        return args
      },
      opts.pre['block.put'],
      post(
        (...args) => getIpfs().block.put(...args),
        blockToJson
      )
    ), opts),
    get: expose('ipfs.block.get', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['block.get'],
      post(
        (...args) => getIpfs().block.get(...args),
        blockToJson
      )
    ), opts),
    stat: expose('ipfs.block.stat', pre(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.pre['block.stat'],
      (...args) => getIpfs().block.stat(...args)
    ), opts)
  }
}
