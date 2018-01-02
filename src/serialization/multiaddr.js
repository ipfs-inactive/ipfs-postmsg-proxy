import Multiaddr from 'multiaddr'

export const multiaddrFromJson = (obj) => new Multiaddr(obj.multiaddr)

export const multiaddrToJson = (multiaddr) => ({
  __ipfsPostMsgProxyType: 'Multiaddr',
  multiaddr: multiaddr.toString()
})

export const isMultiaddr = (obj) => obj && Multiaddr.isMultiaddr(obj)
export const isMultiaddrJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Multiaddr'
