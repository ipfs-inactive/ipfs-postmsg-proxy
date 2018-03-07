console.log('CLIENT: main')

const Ipfs = require('ipfs')
const { createProxyServer, closeProxyServer } = require('../../../../../lib')
const sender = 'ipfs-postmsg-proxy:test:server'

window.addEventListener('message', (e) => {
  const data = e.data || {}
  console.log('received message', data)
  if (data.sender !== 'ipfs-postmsg-proxy:test:client') return
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
    console.log('start', opts)
    ipfs = await getIpfs(opts)
    proxy = createProxyServer(() => ipfs, {
      postMessage: window.parent.postMessage.bind(window.parent)
    })

    window.parent.postMessage({ sender, action: 'started' }, '*')
  },

  dismantle () {
    console.log('dismantle')
    if (ipfs && proxy) {
      closeProxyServer(proxy)
      proxy = null
      ipfs.stop()
      ipfs = null
    }
  }
}

// Patch up the logging so we get some useful info in the console from this side
// of the iframe!

const consoleLog = console.log
const consoleError = console.error

function log () {
  const args = Array.from(arguments)
  consoleLog.apply(console, args)
  try {
    window.parent.postMessage({ sender, action: 'log', args }, '*')
  } catch (err) {
    consoleError('Failed to post log message', err)
  }
}

console.log = log
console.error = log

window.onerror = (message, source, lineno, colno, error) =>
  log({ message: error.message, stack: error.stack })

window.parent.postMessage({ sender, action: 'ready' }, '*')
