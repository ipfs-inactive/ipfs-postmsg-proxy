import { expose } from 'postmsg-rpc'
import { post } from 'prepost'
import { isBig, bigToJson } from '../serialization/big'

export default function (getIpfs, opts) {
  return {
    stat: expose('ipfs.bitswap.stat', post(
      (...args) => getIpfs().bitswap.stat(...args),
      (stats) => {
        if (stats) {
          if (isBig(stats.blocksReceived)) {
            stats.blocksReceived = bigToJson(stats.blocksReceived)
          }

          if (isBig(stats.dataReceived)) {
            stats.dataReceived = bigToJson(stats.dataReceived)
          }

          if (isBig(stats.blocksSent)) {
            stats.blocksSent = bigToJson(stats.blocksSent)
          }

          if (isBig(stats.dataSent)) {
            stats.dataSent = bigToJson(stats.dataSent)
          }

          if (isBig(stats.dupBlksReceived)) {
            stats.dupBlksReceived = bigToJson(stats.dupBlksReceived)
          }

          if (isBig(stats.dupDataReceived)) {
            stats.dupDataReceived = bigToJson(stats.dupDataReceived)
          }
        }

        return stats
      }
    ), opts)
  }
}
