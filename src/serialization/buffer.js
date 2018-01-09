export const bufferFromJson = (obj) => Buffer.from(obj.data)

export const bufferToJson = (buf) => ({
  __ipfsPostMsgProxyType: 'Buffer',
  data: JSON.stringify(buf).data
})

export const isBuffer = Buffer.isBuffer
export const isBufferJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Buffer'
