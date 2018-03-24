import { expose } from 'postmsg-rpc'
import { post } from 'prepost'
import { bigToJson } from '../serialization/big'

export default function (getIpfs, opts) {
  return {
    stat: expose('ipfs.bitswap.stat', post(
      (...args) => getIpfs().bitswap.stat(...args),
      (res) => {
        res.blocksReceived = bigToJson(res.blocksReceived)
        res.dataReceived = bigToJson(res.dataReceived)
        res.blocksSent = bigToJson(res.blocksSent)
        res.dataSent = bigToJson(res.dataSent)
        res.dupBlksReceived = bigToJson(res.dupBlksReceived)
        res.dupDataReceived = bigToJson(res.dupDataReceived)
        return res
      }
    ), opts)
  }
}
