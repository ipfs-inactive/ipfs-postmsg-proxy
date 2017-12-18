console.log('CLIENT: main')

const Ipfs = require('ipfs')
const { createProxyServer, closeProxyServer } = require('../../../../lib')
const sender = 'ipfs-postmsg-proxy:test:client'

window.addEventListener('message', (e) => {
  const data = e.data || {}
  log('received message', data)
  if (data.sender !== 'ipfs-postmsg-proxy:test:server') return
  if (!Actions[data.action]) return console.error(`Unknown action ${data.action}`)
  Actions[data.action].apply(null, data.args || [])
})

let ipfs, proxy

const getIpfs = (opts) => new Promise((resolve, reject) => {
  const ipfs = new Ipfs(opts)
  if (ipfs.isOnline()) return resolve(ipfs)
  ipfs.on('ready', () => resolve(ipfs)).on('error', reject)
})

const Actions = {
  async start (opts) {
    log('start', opts)
    ipfs = await getIpfs(opts)
    proxy = createProxyServer(() => ipfs, {
      postMessage: (msg, origin) => window.parent.postMessage(msg, origin)
    })

    window.parent.postMessage({ sender, action: 'started' }, '*')
  },

  dismantle () {
    log('dismantle')
    if (ipfs && proxy) {
      closeProxyServer(proxy)
      proxy = null
      ipfs.stop()
      ipfs = null
    }
  }
}

function log () {
  const args = Array.from(arguments)
  console.log.apply(console, args)
  window.parent.postMessage({ sender, action: 'log', args }, '*')
}

window.parent.postMessage({ sender, action: 'ready' }, '*')
