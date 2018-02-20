import Big from 'big.js'

export const bigFromJson = (obj) => Big(obj.value)

export const bigToJson = (big) => ({
  __ipfsPostMsgProxyType: 'Big',
  value: big.toJSON()
})

export const isBig = (obj) => obj && obj.constructor && obj.constructor.name === 'Big'
export const isBigJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Big'
