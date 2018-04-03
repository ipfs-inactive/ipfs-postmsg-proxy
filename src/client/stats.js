import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { post } from 'prepost'
import defer from 'pull-defer'
import PMS from 'pull-postmsg-stream'
import toStream from 'pull-stream-to-stream'
import { isBigJson, bigFromJson } from '../serialization/big'

export default function (opts) {
  const api = {
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
    ),
    bwReadableStream () {
      return toStream.source(api.bwPullStream(...arguments))
    },
    bwPullStream: (() => {
      const bwPullStream = post(
        caller('ipfs.stats.bwPullStream', opts),
        (res) => PMS.source(res.name, Object.assign({}, opts, {
          post (res) {
            const stats = res.data

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

            return res
          }
        }))
      )

      return (...args) => {
        const deferred = defer.source()

        bwPullStream(...args)
          .then((res) => deferred.resolve(res))
          .catch((err) => deferred.abort(err))

        return deferred
      }
    })()
  }

  return api
}
