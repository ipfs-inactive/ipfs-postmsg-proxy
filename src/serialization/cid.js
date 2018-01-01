import CID from 'cids'

export const cidFromJson = (obj) => new CID(obj.version, obj.codec, Buffer.from(obj.hash))

export const cidToJson = (cid) => Object.assign(
  { __ipfsPostMsgProxyType: 'CID' },
  cid.toJSON()
)

export const isCid = (obj) => obj && CID.isCID(obj)
export const isCidJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'CID'
