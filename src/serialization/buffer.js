import { preArrayOf } from './utils/prepost-array-of'

export const bufferFromJson = (obj) => Buffer.from(JSON.parse(obj.data).data)

export const bufferToJson = (buf) => ({
  __ipfsPostMsgProxyType: 'Buffer',
  data: JSON.stringify(buf)
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

export const preArrayOfBufferToJson = (index) => preArrayOf(index, isBuffer, bufferToJson)
export const preArrayOfBufferFromJson = (index) => preArrayOf(index, isBufferJson, bufferFromJson)
