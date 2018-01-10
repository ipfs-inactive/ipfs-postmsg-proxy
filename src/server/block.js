import { expose } from 'postmsg-rpc'
import { blockToJson, blockFromJson, isBlockJson } from '../serialization/block'
import { cidFromJson, isCidJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'
import { preCall, postCall } from '../fn-call'

export default function (getIpfs, opts) {
  return {
    put: expose('ipfs.block.put', preCall(
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
      opts.preCall['block.put'],
      postCall(
        (...args) => getIpfs().block.put(...args),
        blockToJson
      )
    ), opts),
    get: expose('ipfs.block.get', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['block.get'],
      postCall(
        (...args) => getIpfs().block.get(...args),
        blockToJson
      )
    ), opts),
    stat: expose('ipfs.block.stat', preCall(
      (...args) => {
        if (isBufferJson(args[0])) {
          args[0] = bufferFromJson(args[0])
        } else if (isCidJson(args[0])) {
          args[0] = cidFromJson(args[0])
        }

        return args
      },
      opts.preCall['block.stat'],
      (...args) => getIpfs().block.stat(...args)
    ), opts)
  }
}
