import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { isBig, bigToJson } from '../serialization/big'

export default function (getIpfs, opts) {
  return {
    gc: expose('ipfs.repo.gc', pre(
      opts.pre('repo.gc'),
      (...args) => getIpfs().repo.gc(...args)
    ), opts),
    stat: expose('ipfs.repo.stat', pre(
      opts.pre('repo.stat'),
      post(
        (...args) => getIpfs().repo.stat(...args),
        (stats) => {
          if (stats) {
            if (isBig(stats.numObjects)) {
              stats.numObjects = bigToJson(stats.numObjects)
            }

            if (isBig(stats.repoSize)) {
              stats.repoSize = bigToJson(stats.repoSize)
            }

            if (isBig(stats.storageMax)) {
              stats.storageMax = bigToJson(stats.storageMax)
            }
          }

          return stats
        }
      )
    ), opts),
    version: expose('ipfs.repo.version', pre(
      opts.pre('repo.version'),
      () => getIpfs().repo.version()
    ), opts)
  }
}
