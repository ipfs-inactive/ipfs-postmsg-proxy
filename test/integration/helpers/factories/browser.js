const { createProxyClient } = require('../../../../lib')
const defaultConfig = { EXPERIMENTAL: { pubsub: true } }

class BrowserIpfsFactory {
  constructor () {
    this.contexts = []
  }

  spawnNode () {
    console.log('CLIENT: spawn node')
    const args = Array.from(arguments)
    const cb = args.pop()

    const onMessage = (e) => {
      console.log('CLIENT: received message', e.data)
      const data = e.data || {}
      if (e.source !== iframe.contentWindow) return
      if (data.sender !== 'ipfs-postmsg-proxy:test:server') return
      if (!Actions[data.action]) return console.error(`Unknown action ${data.action}`)
      Actions[data.action].apply(null, data.args || [])
    }

    const Actions = {
      ready () {
        console.log('CLIENT: server is ready')
        args[0] = Object.assign({}, defaultConfig, args[0])
        iframe.contentWindow.postMessage({
          sender: 'ipfs-postmsg-proxy:test:client',
          action: 'start',
          args
        }, '*')
      },
      started () {
        console.log('CLIENT: server ipfs is started')
        cb(null, createProxyClient({
          postMessage: iframe.contentWindow.postMessage.bind(iframe.contentWindow)
        }))
      },
      log () {
        console.log.apply(console, ['SERVER:'].concat(Array.from(arguments)))
      }
    }

    window.addEventListener('message', onMessage)

    const iframe = document.createElement('iframe')
    iframe.src = '/base/test/fixtures/public/iframe/index.html'
    document.body.appendChild(iframe)

    this.contexts.push({ iframe, onMessage })
  }

  dismantle (cb) {
    console.log('CLIENT: dismantle')
    this.contexts.forEach((ctx) => {
      ctx.iframe.contentWindow.postMessage({
        sender: 'ipfs-postmsg-proxy:test:client',
        action: 'dismantle'
      }, '*')
      ctx.iframe.parentNode.removeChild(ctx.iframe)
      window.removeEventListener('message', ctx.onMessage)
    })
    cb()
  }
}

module.exports = BrowserIpfsFactory
