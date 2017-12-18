/* eslint-env mocha */

const test = require('interface-ipfs-core')
const { createProxyClient } = require('../lib')

let factory

const common = {
  setup (cb) {
    const contexts = []

    factory = {
      spawnNode () {
        console.log('SERVER: spawn node')
        const args = Array.from(arguments)
        const cb = args.pop()

        const onMessage = (e) => {
          console.log('SERVER: received message', e.data)
          const data = e.data || {}
          if (data.sender !== 'ipfs-postmsg-proxy:test:client') return
          if (!Actions[data.action]) return console.error(`Unknown action ${data.action}`)
          Actions[data.action].apply(null, data.args || [])
        }

        const Actions = {
          ready () {
            console.log('SERVER: client is ready')
            iframe.contentWindow.postMessage({
              sender: 'ipfs-postmsg-proxy:test:server',
              action: 'start',
              args
            }, '*')
          },
          started () {
            console.log('SERVER: client ipfs is started')
            cb(null, createProxyClient({
              postMessage: (msg, origin) => iframe.contentWindow.postMessage(msg, origin)
            }))
          },
          log (msg) {
            console.log('CLIENT: ' + msg)
          }
        }

        window.addEventListener('message', onMessage)

        const iframe = document.createElement('iframe')
        iframe.src = 'iframe/index.html'
        document.body.appendChild(iframe)

        contexts.push({ iframe, onMessage })
      },

      dismantle (cb) {
        console.log('SERVER: dismantle')
        contexts.forEach((ctx) => {
          ctx.iframe.contentWindow.postMessage({
            sender: 'ipfs-postmsg-proxy:test:server',
            action: 'dismantle'
          }, '*')
          ctx.iframe.parentNode.removeChild(ctx.iframe)
          window.removeEventListener('message', ctx.onMessage)
        })
        cb()
      }
    }

    cb(null, factory)
  },

  teardown: function (cb) {
    factory.dismantle(cb)
  }
}

test.block(common)
test.config(common)
test.dag(common)
test.dht(common)
test.files(common)
test.key(common)
test.miscellaneous(common)
test.object(common)
test.pin(common)
test.pubsub(common)
test.swarm(common)