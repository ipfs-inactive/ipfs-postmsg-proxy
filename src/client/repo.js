import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { post } from 'prepost'
import { isBigJson, bigFromJson } from '../serialization/big'

export default function (opts) {
  return {
    gc: callbackify.variadic(caller('ipfs.repo.gc', opts)),
    stat: callbackify.variadic(
      post(
        caller('ipfs.repo.stat', opts),
        (stats) => {
          if (stats) {
            if (isBigJson(stats.numObjects)) {
              stats.numObjects = bigFromJson(stats.numObjects)
            }

            if (isBigJson(stats.repoSize)) {
              stats.repoSize = bigFromJson(stats.repoSize)
            }

            if (isBigJson(stats.storageMax)) {
              stats.storageMax = bigFromJson(stats.storageMax)
            }
          }

          return stats
        }
      )
    ),
    version: callbackify(caller('ipfs.repo.version', opts))
  }
}
