import { expose, caller } from 'postmsg-rpc'
import { preCall } from '../fn-call'
import { isFunctionJson } from '../serialization/function'
import { isBufferJson, bufferFromJson } from '../serialization/buffer'

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
    publish: expose('ipfs.pubsub.publish', preCall(
      (...args) => {
        if (isBufferJson(args[1])) {
          args[1] = bufferFromJson(args[1])
        }

        return args
      },
      opts.preCall['pubsub.publish'],
      (...args) => getIpfs().pubsub.publish(...args)
    ), opts),
    subscribe: expose('ipfs.pubsub.subscribe', function (...args) {
      let sub

      return preCall(
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
        opts.preCall['pubsub.subscribe'],
        (...args) => {
          return getIpfs().pubsub.subscribe(...args)
            .catch((err) => {
              subs.splice(subs.indexOf(sub), 1)
              throw err
            })
        }
      )(...args)
    }, opts),
    unsubscribe: expose('ipfs.pubsub.unsubscribe', preCall(
      (...args) => {
        const topic = args[0]

        if (isFunctionJson(args[1])) {
          const sub = subs.find((s) => s.topic === topic && s.rpc.fnName === args[1].name)
          args[1] = sub.rpc.stubFn
          subs.splice(subs.indexOf(sub), 1)
        }

        return args
      },
      opts.preCall['pubsub.unsubscribe'],
      (...args) => {
        getIpfs().pubsub.unsubscribe(...args)
        return Promise.resolve()
      }
    ), opts),
    peers: expose('ipfs.pubsub.peers', preCall(
      opts.preCall['pubsub.peers'],
      (...args) => getIpfs().pubsub.peers(...args)
    ), opts),
    ls: expose('ipfs.pubsub.ls', preCall(
      opts.preCall['pubsub.ls'],
      (...args) => getIpfs().pubsub.ls(...args)
    ), opts)
  }

  return api
}
