export const bufferFromJson = (obj) => Buffer.from(obj.data)

export const bufferToJson = (buf) => ({
  __ipfsPostMsgProxyType: 'Buffer',
  data: Array.from(buf)
})

export const isBuffer = Buffer.isBuffer
export const isBufferJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Buffer'

export const preBufferFromJson = (index) => {
  return (...args) => {
    if (isBufferJson(args[index])) {
      args[index] = bufferFromJson(args[index])
    }
    return args
  }
}

export const preBufferToJson = (index) => {
  return (...args) => {
    if (isBuffer(args[index])) {
      args[index] = bufferToJson(args[index])
    }
    return args
  }
}
