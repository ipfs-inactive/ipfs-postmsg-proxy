import PeerInfo from 'peer-info'
import PeerId from 'peer-id'
import multiaddr from 'multiaddr'
import multibase from 'multibase'
import multihash from 'multihashes'
import CID from 'cids'
import dagPB from 'ipld-dag-pb'
import dagCBOR from 'ipld-dag-cbor'

export default () => ({
  Buffer,
  PeerId,
  PeerInfo,
  multiaddr,
  multibase,
  multihash,
  CID,
  dagPB,
  dagCBOR
})
