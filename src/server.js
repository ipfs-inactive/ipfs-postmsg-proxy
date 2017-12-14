const { expose } = require('postmsg-rpc')

module.exports = (getIpfs, opts) => {
  return {
    id: expose('ipfs.id', () => getIpfs().id(), opts),
    version: expose('ipfs.version', () => getIpfs().version(), opts)
  }
}
