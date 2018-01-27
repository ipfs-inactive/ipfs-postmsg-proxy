import { expose } from 'postmsg-rpc'
import { pre } from 'prepost'
import { isCidJson, cidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'

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
    ), opts)
  }
}
