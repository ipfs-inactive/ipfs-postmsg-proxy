import { expose, caller } from 'postmsg-rpc'
import { pre } from 'prepost'
import { isFunctionJson } from '../serialization/function'
import { isBuffer, bufferToJson, preBufferFromJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  const subs = [
  /*
    {
      topic,    // name of the topic subscribed to
      rpc: {    // details of the RPC stub created to send updates
        fnName, // the RPC function name the stub calls
        stubFn  // the RPC stub function created by postmsg-rpc
      }
    }
  */
  ]

  const api = {
    publish: expose('ipfs.pubsub.publish', pre(
      preBufferFromJson(1),
      opts.pre('pubsub.publish'),
      (...args) => getIpfs().pubsub.publish(...args)
    ), opts),
    subscribe: expose('ipfs.pubsub.subscribe', function (...args) {
      let sub

      return pre(
        (...args) => {
          const topic = args[0]
          const handlerIndex = args.length === 3 ? 2 : 1

          if (isFunctionJson(args[handlerIndex])) {
            const stubFn = pre(
              (...args) => {
                if (args[0]) {
                  args[0] = Object.assign({}, args[0])

                  if (isBuffer(args[0].data)) {
                    args[0].data = bufferToJson(args[0].data)
                  }

                  if (isBuffer(args[0].seqno)) {
                    args[0].seqno = bufferToJson(args[0].seqno)
                  }
                }

                return args
              },
              caller(args[handlerIndex].name, opts)
            )

            sub = {
              topic,
              rpc: {
                fnName: args[handlerIndex].name,
                stubFn
              }
            }

            subs.push(sub)

            args[handlerIndex] = stubFn
          }

          return args
        },
        opts.pre('pubsub.subscribe'),
        (...args) => {
          return getIpfs().pubsub.subscribe(...args)
            .catch((err) => {
              subs.splice(subs.indexOf(sub), 1)
              throw err
            })
        }
      )(...args)
    }, opts),
    unsubscribe: expose('ipfs.pubsub.unsubscribe', pre(
      (...args) => {
        const topic = args[0]

        if (isFunctionJson(args[1])) {
          const sub = subs.find((s) => s.topic === topic && s.rpc.fnName === args[1].name)

          if (sub) {
            args[1] = sub.rpc.stubFn
            subs.splice(subs.indexOf(sub), 1)
          } else {
            // Well, we don't have a reference to it, so the ipfs node won't
            // either. We shouldn't error either because ipfs won't.
            args[1] = () => {}
          }
        }

        return args
      },
      opts.pre('pubsub.unsubscribe'),
      (...args) => new Promise((resolve) => {
        getIpfs().pubsub.unsubscribe(...args)
        resolve()
      })
    ), opts),
    peers: expose('ipfs.pubsub.peers', pre(
      opts.pre('pubsub.peers'),
      (...args) => getIpfs().pubsub.peers(...args)
    ), opts),
    ls: expose('ipfs.pubsub.ls', pre(
      // FIXME: The interface-ipfs-core tests call ls straight after unsubscribe.
      // Unsubscribe in js-ipfs is synchronous but it HAS to be async in the
      // proxy because window.postMessage is asynchronous.
      (...args) => new Promise((resolve) => setTimeout(() => resolve(args))),
      opts.pre('pubsub.ls'),
      (...args) => getIpfs().pubsub.ls(...args)
    ), opts)
  }

  // Clean up any subscriptions on close
  api.subscribe.close = pre(
    (...args) => {
      subs.forEach((sub) => getIpfs().pubsub.unsubscribe(sub.topic, sub.rpc.stubFn))
      return args
    },
    api.subscribe.close
  )

  return api
}
