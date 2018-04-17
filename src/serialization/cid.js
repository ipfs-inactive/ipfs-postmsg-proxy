import CID from 'cids'
import { bufferFromJson, bufferToJson } from './buffer'
import { preArrayOf } from './utils/prepost-array-of'

export const cidFromJson = (obj) => new CID(obj.version, obj.codec, bufferFromJson(obj.hash))

export const cidToJson = (cid) => ({
  __ipfsPostMsgProxyType: 'CID',
  codec: cid.codec,
  version: cid.version,
  hash: bufferToJson(cid.multihash)
})

export const isCid = CID.isCID
export const isCidJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'CID'

export const preCidFromJson = (index) => {
  return (...args) => {
    if (isCidJson(args[index])) {
      args[index] = cidFromJson(args[index])
    }
    return args
  }
}

export const preCidToJson = (index) => {
  return (...args) => {
    if (isCid(args[index])) {
      args[index] = cidToJson(args[index])
    }
    return args
  }
}

export const preArrayOfCidToJson = (index) => preArrayOf(index, isCid, cidToJson)
export const preArrayOfCidFromJson = (index) => preArrayOf(index, isCidJson, cidFromJson)
