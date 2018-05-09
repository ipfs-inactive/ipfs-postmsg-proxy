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

          if (isFunctionJson(args[1])) {
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
              caller(args[1].name, opts)
            )

            sub = {
              topic,
              rpc: {
                fnName: args[1].name,
                stubFn
              }
            }

            subs.push(sub)

            args[1] = stubFn
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
      (...args) => getIpfs().pubsub.unsubscribe(...args)
    ), opts),
    peers: expose('ipfs.pubsub.peers', pre(
      opts.pre('pubsub.peers'),
      (...args) => getIpfs().pubsub.peers(...args)
    ), opts),
    ls: expose('ipfs.pubsub.ls', pre(
      opts.pre('pubsub.ls'),
      (...args) => getIpfs().pubsub.ls(...args)
    ), opts)
  }

  // Clean up any subscriptions on close
  api.subscribe.close = pre(
    (...args) => {
      return Promise.all(
        subs.map((sub) => getIpfs().pubsub.unsubscribe(sub.topic, sub.rpc.stubFn))
      ).then(() => args)
    },
    api.subscribe.close
  )

  return api
}
