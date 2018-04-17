import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { postArrayOf } from '../serialization/utils/prepost-array-of'
import { isMultiaddr, multiaddrToJson } from '../serialization/multiaddr'

export default function (getIpfs, opts) {
  return {
    add: expose('ipfs.bootstrap.add', pre(
      opts.pre('bootstrap.add'),
      post(
        (...args) => getIpfs().bootstrap.add(...args),
        postArrayOf('Peers', isMultiaddr, multiaddrToJson)
      )
    ), opts)
  }
}
