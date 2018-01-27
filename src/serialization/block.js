import Block from 'ipfs-block'
import { cidFromJson, cidToJson } from './cid'
import { bufferFromJson, bufferToJson } from './buffer'

export const blockToJson = (block) => ({
  __ipfsPostMsgProxyType: 'Block',
  cid: cidToJson(block.cid),
  data: bufferToJson(block.data)
})

export const blockFromJson = (obj) => {
  const cid = cidFromJson(obj.cid)
  const data = bufferFromJson(obj.data)
  return new Block(data, cid)
}

export const isBlock = (obj) => obj && Block.isBlock(obj)
export const isBlockJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Block'

export const preBlockFromJson = (index) => {
  return (...args) => {
    if (isBlockJson(args[index])) {
      args[index] = blockFromJson(args[index])
    }
    return args
  }
}

export const preBlockToJson = (index) => {
  return (...args) => {
    if (isBlock(args[index])) {
      args[index] = blockToJson(args[index])
    }
    return args
  }
}
