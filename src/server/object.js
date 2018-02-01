import { expose } from 'postmsg-rpc'
import { pre, post } from 'prepost'
import { dagNodeToJson, preDagNodeFromJson, dagLinkToJson, preDagLinkFromJson } from '../serialization/dag'
import { preCidFromJson } from '../serialization/cid'
import { isBufferJson, bufferFromJson, preBufferFromJson, bufferToJson } from '../serialization/buffer'

export default function (getIpfs, opts) {
  return {
    new: expose('ipfs.object.new', pre(
      opts.pre('object.new'),
      post(
        (...args) => getIpfs().object.new(...args),
        dagNodeToJson
      )
    ), opts),
    put: expose('ipfs.object.put', pre(
      preDagNodeFromJson(0),
      preBufferFromJson(0),
      (...args) => {
        if (args[0] && isBufferJson(args[0].Data)) {
          args[0].Data = bufferFromJson(args[0].Data)
        }

        return args
      },
      opts.pre('object.put'),
      post(
        (...args) => getIpfs().object.put(...args),
        dagNodeToJson
      )
    ), opts),
    get: expose('ipfs.object.get', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('object.get'),
      post(
        (...args) => getIpfs().object.get(...args),
        dagNodeToJson
      )
    ), opts),
    data: expose('ipfs.object.data', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('object.data'),
      post(
        (...args) => getIpfs().object.data(...args),
        bufferToJson
      )
    ), opts),
    links: expose('ipfs.object.links', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('object.links'),
      post(
        (...args) => getIpfs().object.links(...args),
        (res) => res.map(dagLinkToJson)
      )
    ), opts),
    stat: expose('ipfs.object.stat', pre(
      preBufferFromJson(0),
      preCidFromJson(0),
      opts.pre('object.stat'),
      (...args) => getIpfs().object.stat(...args)
    ), opts),
    patch: {
      addLink: expose('ipfs.object.patch.addLink', pre(
        preBufferFromJson(0),
        preCidFromJson(0),
        preDagLinkFromJson(1),
        opts.pre('object.patch.addLink'),
        post(
          (...args) => getIpfs().object.patch.addLink(...args),
          dagNodeToJson
        )
      ), opts),
      rmLink: expose('ipfs.object.patch.rmLink', pre(
        preBufferFromJson(0),
        preCidFromJson(0),
        preDagLinkFromJson(1),
        opts.pre('object.patch.rmLink'),
        post(
          (...args) => getIpfs().object.patch.rmLink(...args),
          dagNodeToJson
        )
      ), opts),
      appendData: expose('ipfs.object.patch.appendData', pre(
        preBufferFromJson(0),
        preCidFromJson(0),
        preBufferFromJson(1),
        opts.pre('object.patch.appendData'),
        post(
          (...args) => getIpfs().object.patch.appendData(...args),
          dagNodeToJson
        )
      ), opts),
      setData: expose('ipfs.object.patch.setData', pre(
        preBufferFromJson(0),
        preCidFromJson(0),
        preBufferFromJson(1),
        opts.pre('object.patch.setData'),
        post(
          (...args) => getIpfs().object.patch.setData(...args),
          dagNodeToJson
        )
      ), opts)
    }
  }
}
