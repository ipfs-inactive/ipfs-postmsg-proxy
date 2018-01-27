import { expose, caller } from 'postmsg-rpc'
import { pre } from 'prepost'
import { isFunctionJson } from '../serialization/function'
import { preBufferFromJson } from '../serialization/buffer'

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
      opts.pre['pubsub.publish'],
      (...args) => getIpfs().pubsub.publish(...args)
    ), opts),
    subscribe: expose('ipfs.pubsub.subscribe', function (...args) {
      let sub

      return pre(
        (...args) => {
          const topic = args[0]
          const handlerIndex = args.length === 3 ? 2 : 1

          if (isFunctionJson(args[handlerIndex])) {
            const stubFn = caller(args[handlerIndex].name, opts)

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
        opts.pre['pubsub.subscribe'],
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
          args[1] = sub.rpc.stubFn
          subs.splice(subs.indexOf(sub), 1)
        }

        return args
      },
      opts.pre['pubsub.unsubscribe'],
      (...args) => new Promise((resolve) => {
        getIpfs().pubsub.unsubscribe(...args)
        resolve()
      })
    ), opts),
    peers: expose('ipfs.pubsub.peers', pre(
      opts.pre['pubsub.peers'],
      (...args) => getIpfs().pubsub.peers(...args)
    ), opts),
    ls: expose('ipfs.pubsub.ls', pre(
      // FIXME: The interface-ipfs-core tests call ls straight after unsubscribe.
      //
      // Unsubscribe in js-ipfs is synchronous but it HAS to be async in the
      // proxy partly because of the way it is coded but mostly because
      // window.postMessage is asynchronous.
      (...args) => new Promise((resolve) => setTimeout(() => resolve(args))),
      opts.pre['pubsub.ls'],
      (...args) => getIpfs().pubsub.ls(...args)
    ), opts)
  }

  return api
}
