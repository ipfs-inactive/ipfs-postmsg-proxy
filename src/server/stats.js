import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { isBig, bigToJson } from '../serialization/big'

export default function (getIpfs, opts) {
  return {
    bw: expose('ipfs.stats.bw', pre(
      opts.pre('stats.bw'),
      post(
        (...args) => getIpfs().stats.bw(...args),
        (stats) => {
          if (stats) {
            if (isBig(stats.totalIn)) {
              stats.totalIn = bigToJson(stats.totalIn)
            }

            if (isBig(stats.totalOut)) {
              stats.totalOut = bigToJson(stats.totalOut)
            }

            if (isBig(stats.rateIn)) {
              stats.rateIn = bigToJson(stats.rateIn)
            }

            if (isBig(stats.rateOut)) {
              stats.rateOut = bigToJson(stats.rateOut)
            }
          }

          return stats
        }
      )
    ), opts)
  }
}
