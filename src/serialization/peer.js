import PeerInfo from 'peer-info'
import PeerId from 'peer-id'
import { multiaddrToJson, multiaddrFromJson } from './multiaddr'

export const peerInfoFromJson = (obj) => {
  return peerIdFromJson(obj.id)
    .then((peerId) => {
      const peerInfo = new PeerInfo(peerId)

      obj.multiaddrs.forEach((multiaddr) => {
        peerInfo.multiaddrs.add(multiaddrFromJson(multiaddr))
      })

      if (obj._connectedMultiaddr) {
        peerInfo.connect(multiaddrFromJson(obj._connectedMultiaddr))
      }

      return peerInfo
    })
}

export const peerInfoToJson = (peerInfo) => ({
  __ipfsPostMsgProxyType: 'PeerInfo',
  id: peerIdToJson(peerInfo.id),
  multiaddrs: peerInfo.multiaddrs.toArray().map(multiaddrToJson),
  _connectedMultiaddr: peerInfo._connectedMultiaddr
    ? multiaddrToJson(peerInfo._connectedMultiaddr)
    : null
})

export const isPeerInfo = PeerInfo.isPeerInfo
export const isPeerInfoJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'PeerInfo'

export const prePeerInfoFromJson = (index) => {
  return (...args) => {
    if (isPeerInfoJson(args[index])) {
      args[index] = peerInfoFromJson(args[index])
    }
    return args
  }
}

export const prePeerInfoToJson = (index) => {
  return (...args) => {
    if (isPeerInfo(args[index])) {
      args[index] = peerInfoToJson(args[index])
    }
    return args
  }
}

export const peerIdFromJson = (obj) => new Promise((resolve, reject) => {
  PeerId.createFromJSON(obj, (err, peerId) => {
    if (err) return reject(err)
    resolve(peerId)
  })
})

export const peerIdToJson = (peerId) => Object.assign(
  { __ipfsPostMsgProxyType: 'PeerId' },
  peerId.toJSON()
)

export const isPeerId = PeerId.isPeerId
export const isPeerIdJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'PeerId'

export const prePeerIdFromJson = (index) => {
  return (...args) => {
    if (isPeerIdJson(args[index])) {
      args[index] = peerIdFromJson(args[index])
    }
    return args
  }
}

export const prePeerIdToJson = (index) => {
  return (...args) => {
    if (isPeerId(args[index])) {
      args[index] = peerIdToJson(args[index])
    }
    return args
  }
}
