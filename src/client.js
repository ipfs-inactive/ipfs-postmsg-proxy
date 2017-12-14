const { caller } = require('postmsg-rpc')
const callbackify = require('callbackify')

module.exports = (opts) => {
  return {
    id: callbackify(caller('ipfs.id', opts)),
    version: callbackify(caller('ipfs.version', opts))
  }
}
