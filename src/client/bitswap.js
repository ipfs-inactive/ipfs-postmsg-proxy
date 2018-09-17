import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { post } from 'prepost'
import { isBigJson, bigFromJson } from '../serialization/big'

export default function (opts) {
  return {
    ledger: callbackify.variadic(caller('ipfs.bitswap.ledger', opts)),
    reprovide: callbackify.variadic(caller('ipfs.bitswap.reprovide', opts)),
    stat: callbackify(
      post(
        caller('ipfs.bitswap.stat', opts),
        (stats) => {
          if (stats) {
            if (isBigJson(stats.blocksReceived)) {
              stats.blocksReceived = bigFromJson(stats.blocksReceived)
            }

            if (isBigJson(stats.dataReceived)) {
              stats.dataReceived = bigFromJson(stats.dataReceived)
            }

            if (isBigJson(stats.blocksSent)) {
              stats.blocksSent = bigFromJson(stats.blocksSent)
            }

            if (isBigJson(stats.dataSent)) {
              stats.dataSent = bigFromJson(stats.dataSent)
            }

            if (isBigJson(stats.dupBlksReceived)) {
              stats.dupBlksReceived = bigFromJson(stats.dupBlksReceived)
            }

            if (isBigJson(stats.dupDataReceived)) {
              stats.dupDataReceived = bigFromJson(stats.dupDataReceived)
            }
          }

          return stats
        }
      )
    ),
    unwant: callbackify.variadic(caller('ipfs.bitswap.unwant', opts)),
    wantlist: callbackify.variadic(caller('ipfs.bitswap.wantlist', opts))
  }
}
