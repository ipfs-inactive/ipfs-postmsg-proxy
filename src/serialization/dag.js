import { DAGNode, DAGLink } from 'ipld-dag-pb'
import { bufferFromJson, bufferToJson } from './buffer'

export const dagNodeFromJson = (obj) => {
  return new Promise((resolve, reject) => {
    const links = obj.links.map(dagLinkFromJson)
    DAGNode.create(bufferFromJson(obj.data), links, (err, dagNode) => {
      if (err) return reject(err)
      resolve(dagNode)
    })
  })
}

export const dagNodeToJson = (dagNode) => ({
  __ipfsPostMsgProxyType: 'DAGNode',
  links: dagNode.links.map(dagLinkToJson),
  data: bufferToJson(dagNode.data)
})

export const isDagNode = (obj) => DAGNode.isDAGNode(obj)
export const isDagNodeJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'DAGNode'

export const preDagNodeFromJson = (index) => {
  return (...args) => {
    if (isDagNodeJson(args[index])) {
      return dagNodeFromJson(args[index])
        .then((dagNode) => {
          args[index] = dagNode
          return args
        })
    }
    return args
  }
}

export const preDagNodeToJson = (index) => {
  return (...args) => {
    if (isDagNode(args[index])) {
      args[index] = dagNodeToJson(args[index])
    }
    return args
  }
}

export const dagLinkFromJson = (obj) => new DAGLink(obj.name, obj.size, obj.multihash)

export const dagLinkToJson = (link) => Object.assign(
  { __ipfsPostMsgProxyType: 'DAGLink' },
  link.toJSON()
)

export const isDagLink = (obj) => DAGLink.isDAGLink(obj)
export const isDagLinkJson = (obj) => obj && obj.__ipfsPostMsgProxyType === 'DAGLink'

export const preDagLinkFromJson = (index) => {
  return (...args) => {
    if (isDagLinkJson(args[index])) {
      args[index] = dagLinkFromJson(args[index])
    }
    return args
  }
}

export const preDagLinkToJson = (index) => {
  return (...args) => {
    if (isDagLink(args[index])) {
      args[index] = dagLinkToJson(args[index])
    }
    return args
  }
}
