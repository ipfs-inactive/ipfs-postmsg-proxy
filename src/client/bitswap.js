import { caller } from 'postmsg-rpc'
import callbackify from 'callbackify'
import { post } from 'prepost'
import { bigFromJson } from '../serialization/big'

export default function (opts) {
  return {
    stat: callbackify(
      post(
        caller('ipfs.bitswap.stat', opts),
        (res) => {
          res.blocksReceived = bigFromJson(res.blocksReceived)
          res.dataReceived = bigFromJson(res.dataReceived)
          res.blocksSent = bigFromJson(res.blocksSent)
          res.dataSent = bigFromJson(res.dataSent)
          res.dupBlksReceived = bigFromJson(res.dupBlksReceived)
          res.dupDataReceived = bigFromJson(res.dupDataReceived)
          return res
        }
      )
    )
  }
}
