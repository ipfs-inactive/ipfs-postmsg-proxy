import Multiaddr from 'multiaddr'

export const multiaddrFromJson = (obj) => new Multiaddr(obj.multiaddr)

export const multiaddrToJson = (multiaddr) => ({
  __ipfsPostMsgProxyType: 'Multiaddr',
  multiaddr: multiaddr.toString()
})

export const isMultiaddr = (obj) => obj && Multiaddr.isMultiaddr(obj)
export const isMultiaddrJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'Multiaddr'

export const preMultiaddrFromJson = (index) => {
  return (...args) => {
    if (isMultiaddrJson(args[index])) {
      args[index] = multiaddrFromJson(args[index])
    }
    return args
  }
}

export const preMultiaddrToJson = (index) => {
  return (...args) => {
    if (isMultiaddr(args[index])) {
      args[index] = multiaddrToJson(args[index])
    }
    return args
  }
}
