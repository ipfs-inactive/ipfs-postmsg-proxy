import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { post } from 'prepost'
import { isBigJson, bigFromJson } from '../serialization/big'

export default function (opts) {
  return {
    bw: callbackify.variadic(
      post(
        caller('ipfs.stats.bw', opts),
        (stats) => {
          if (stats) {
            if (isBigJson(stats.totalIn)) {
              stats.totalIn = bigFromJson(stats.totalIn)
            }

            if (isBigJson(stats.totalOut)) {
              stats.totalOut = bigFromJson(stats.totalOut)
            }

            if (isBigJson(stats.rateIn)) {
              stats.rateIn = bigFromJson(stats.rateIn)
            }

            if (isBigJson(stats.rateOut)) {
              stats.rateOut = bigFromJson(stats.rateOut)
            }
          }

          return stats
        }
      )
    )
  }
}
