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
