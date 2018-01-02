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
