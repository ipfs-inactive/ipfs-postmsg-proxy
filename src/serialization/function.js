export const functionToJson = (name) => ({
  __ipfsPostMsgProxyType: 'Function',
  name
})

export const isFunctionJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Function'
