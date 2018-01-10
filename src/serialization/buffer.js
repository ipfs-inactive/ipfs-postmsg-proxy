export const bufferFromJson = (obj) => Buffer.from(obj.data)

export const bufferToJson = (buf) => ({
  __ipfsPostMsgProxyType: 'Buffer',
  data: Array.from(buf)
})

export const isBuffer = Buffer.isBuffer
export const isBufferJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Buffer'
