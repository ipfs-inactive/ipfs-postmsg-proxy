import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import shortid from 'shortid'
import pull from 'pull-stream'
import PMS from 'pull-postmsg-stream'
import { isBig, bigToJson } from '../serialization/big'
import { functionToJson } from '../serialization/function'

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
    ), opts),
    bwPullStream: expose('ipfs.stats.bwPullStream', pre(
      opts.pre('stats.bwPullStream'),
      post(
        (...args) => getIpfs().stats.bwPullStream(...args),
        (res) => new Promise((resolve) => {
          const readFnName = shortid()

          pull(
            res,
            PMS.sink(readFnName, Object.assign({}, opts, {
              post (res) {
                const stats = res.data

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

                return res
              }
            }))
          )

          resolve(functionToJson(readFnName))
        })
      )
    ), opts)
  }
}
