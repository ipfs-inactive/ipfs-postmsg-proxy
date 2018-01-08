import { caller, expose } from 'postmsg-rpc'
import callbackify from 'callbackify'
import shortid from 'shortid'
import isTypedArray from 'is-typedarray'
import { preCall } from '../fn-call'
import { functionToJson } from '../serialization/function'

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
    publish: callbackify.variadic(caller('ipfs.pubsub.publish', opts)),
    subscribe: function (topic, options, handler, cb) {
      let sub

      if (typeof options === 'function') {
        cb = handler
        handler = options
        options = {}
      }

      const stub = preCall(
        (...args) => {
          const handlerIndex = args.length === 3 ? 2 : 1

          subs[topic] = subs[topic] || []

          const fnName = `ipfs.pubsub.subscribe.handler.${shortid()}`

          sub = {
            topic,
            handler,
            rpc: {
              fnName,
              exposedFn: expose(fnName, preCall(
                (...args) => {
                  if (isTypedArray(args[0].data)) {
                    args[0].data = Buffer.from(args[0].data)
                  }

                  if (isTypedArray(args[0].seqno)) {
                    args[0].seqno = Buffer.from(args[0].data)
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

          args[handlerIndex] = functionToJson(fnName)

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
        stub(topic, options, handler)
          .then((res) => process.nextTick(() => cb(null, res)))
          .catch((err) => process.nextTick(() => cb(err)))
      } else {
        return stub(topic, options, handler)
      }
    },
    unsubscribe: preCall(
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
    ),
    peers: callbackify.variadic(caller('ipfs.pubsub.peers', opts)),
    ls: callbackify.variadic(caller('ipfs.pubsub.ls', opts)),
    // interface-ipfs-core tests use this function
    // noop since we're not an EventEmitter
    setMaxListeners: () => api
  }

  return api
}
