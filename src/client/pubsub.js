import { caller, expose } from 'postmsg-rpc'
import callbackify from 'callbackify'
import shortid from 'shortid'
import { pre } from 'prepost'
import { functionToJson } from '../serialization/function'
import { isBufferJson, bufferFromJson, preBufferToJson } from '../serialization/buffer'

export default function (opts) {
  const subs = [
  /*
    {
      topic,      // name of the topic subscribed to
      handler,    // the handler provided by the subscriber - rpc.exposedFn calls this function
      rpc: {      // details of the exposed RPC function created to receive updates
        fnName,   // the RPC function name
        exposedFn // the exposed RPC function created by postmsg-rpc
      }
    }
  */
  ]

  const api = {
    publish: callbackify.variadic(
      pre(
        preBufferToJson(1),
        caller('ipfs.pubsub.publish', opts)
      )
    ),
    subscribe: function (topic, handler, options, cb) {
      let sub

      if (typeof options === 'function') {
        cb = options
        options = {}
      }

      const stub = pre(
        (...args) => {
          const fnName = `ipfs.pubsub.subscribe.handler.${shortid()}`

          sub = {
            topic,
            handler,
            rpc: {
              fnName,
              exposedFn: expose(fnName, pre(
                (...args) => {
                  if (args[0]) {
                    if (isBufferJson(args[0].data)) {
                      args[0].data = bufferFromJson(args[0].data)
                    }

                    if (isBufferJson(args[0].seqno)) {
                      args[0].seqno = bufferFromJson(args[0].seqno)
                    }
                  }

                  return args
                },
                (...args) => {
                  process.nextTick(() => handler(...args))
                  return Promise.resolve()
                }
              ), opts)
            }
          }

          subs.push(sub)

          args[1] = functionToJson(fnName)

          return args
        },
        // If error, then remove subscription handler
        (...args) => {
          return caller('ipfs.pubsub.subscribe', opts)(...args)
            .catch((err) => {
              sub.rpc.exposedFn.close()
              subs.splice(subs.indexOf(sub), 1)
              throw err
            })
        }
      )

      if (cb) {
        stub(topic, handler, options)
          .then((res) => process.nextTick(() => cb(null, res)))
          .catch((err) => process.nextTick(() => cb(err)))
      } else {
        return stub(topic, handler, options)
      }
    },
    unsubscribe: callbackify.variadic(
      pre(
        (...args) => {
          const topic = args[0]
          const sub = subs.find((s) => s.topic === topic && s.handler === args[1])

          if (sub) {
            args[1] = functionToJson(sub.rpc.fnName)
            sub.rpc.exposedFn.close()
            subs.splice(subs.indexOf(sub), 1)
          }

          return args
        },
        caller('ipfs.pubsub.unsubscribe', opts)
      )
    ),
    peers: callbackify.variadic(caller('ipfs.pubsub.peers', opts)),
    ls: callbackify.variadic(caller('ipfs.pubsub.ls', opts)),
    // interface-ipfs-core tests use this function
    // noop since we're not an EventEmitter
    setMaxListeners: () => api
  }

  return api
}
