# ⚠️ Deprecated ⚠️

This library has been deprecated and replaced with more flexible universal libraries for sharing API instance across message port:

- https://www.npmjs.com/package/ipfs-message-port-server 👈 💚
- https://www.npmjs.com/package/ipfs-message-port-client

*This library will not be maintained.*

---



# ipfs-postmsg-proxy

[![Build Status](https://travis-ci.org/ipfs-shipyard/ipfs-postmsg-proxy.svg?branch=master)](https://travis-ci.org/ipfs-shipyard/ipfs-postmsg-proxy) [![dependencies Status](https://david-dm.org/ipfs-shipyard/ipfs-postmsg-proxy/status.svg)](https://david-dm.org/ipfs-shipyard/ipfs-postmsg-proxy)  [![deprecated](https://img.shields.io/badge/status-deprecated-red.svg)](https://www.npmjs.com/package/ipfs-message-port-server)

> Proxy to an IPFS over window.postMessage

The proxy uses [`postmsg-rpc`](https://www.npmjs.com/package/postmsg-rpc) under the hood to create an object which looks like an IPFS instance on the web page. This is just an object with "stubs" (functions) that use `window.postMessage` to communicate with a real IPFS node running in the browser extension. `postmsg-rpc` allows us to create these stubs and expose methods on the IPFS node without having to deal with the complexities of `window.postMessage`.

```
Web page                                               Browser extension
+---------------+-----------------+                    +-------------------+----------------+
|               |                 |                    |                   |                |
|               |                 |                    |                   |                |
|               |                 | window.postMessage |                   |                |
| window.ipfs   +->  call stubs   +--------------------->   exposed api    +->  js-ipfs /   |
|             <-+  (postmsg-rpc) <---------------------+   (postmsg-rpc) <-+    js-ipfs-api |
|               |                 |                    |                   |                |
|               |                 |                    |                   |                |
|               |                 |                    |                   |                |
+-------^-------+-----------------+                    +-------------------+----------------+
        |
        +
interface-ipfs-core
```

We're using `interface-ipfs-core` to test our call stubs which are hooked up to a `js-ipfs`/`js-ipfs-api` on the other end. If the tests pass we know that the proxy is doing a good job of passing messages over the boundary.

When messages are passed using `window.postMessage` the data that is sent is cloned using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). It allows more things to be cloned than just JSON types but there are some things that _cannot be cloned_ without some prior serialization to a format that _can be cloned_ by the algorithm. For this reason, on both the web page and browser extension side we sometimes manually perform this serialization on arguments and return types.

In the web page, we serialize arguments we know cannot be handled by the structured clone algorithm before stubs are called and we deserialize them in the browser extension before exposed functions are called.

In the browser extension we serialize return values after exposed functions are called and deserialize them in the web page after stubs are called.

The [`prepost`](https://www.npmjs.com/package/prepost) module provides these utility functions.

## Install

```sh
npm install ipfs-postmsg-proxy
```

## Usage

In this example, IPFS is running in an iframe.

In iframe window where the js-ipfs node is running, create **iframe.js**:

```js
const IPFS = require('ipfs')
const { createProxyServer, closeProxyServer } = require('ipfs-postmsg-proxy')

const ipfs = new IPFS()

// Create proxy server that talks to the parent window
const server = createProxyServer(() => ipfs, {
  postMessage: window.parent.postMessage.bind(window.parent)
})

// Later, you might want to close the server:
closeProxyServer(server)
```

Browserify/Webpack **iframe.js** to **bundle.js**.

Create **iframe.html**:

```html
<!doctype html>
<script src="bundle.js"></script>
```

In the client window, add the iframe and create a client to talk to it:

```js
const { createProxyClient } = require('ipfs-postmsg-proxy')

const iframe = document.createElement('iframe')
iframe.src = 'iframe.html'
document.body.appendChild(iframe)

// Create proxy client that talks to the iframe
window.ipfs = createProxyClient({
  postMessage: iframe.contentWindow.postMessage.bind(iframe.contentWindow)
})

// You can now interact with IPFS as usual, e.g.
// ipfs.add(new Buffer('HELLO WORLD'), (err, res) => console.log(err, res))
```

## API

#### `createProxyServer(getIpfs, [options])`

Create a proxy server to a running IPFS instance.

* `getIpfs` - a function that returns the IPFS instance. Note this function will be called every time a function needs to be invoked and so shouldn't create a new instance each time!
* `options.postMessage` - function that posts a message (default `window.postMessage`)
* `options.targetOrigin` - passed to postMessage. See [postMessage docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for more info (default `'*'`)
* `options.addListener` - function that adds a listener (default `window.addEventListener`)
* `options.removeListener` - function that removes a listener (default `window.removeEventListener`)
* `options.getMessageData` - a function that extracts data from the event object passed to a `message` event handler (default `(e) => e.data`)
* `options.pre` - an object or a function. If an object, it's values are functions to call prior to invoking functions on the exposed IPFS node. The pre-functions are passed arguments as they would be passed to the exposed IPFS node and are expected to return an array of possibly altered arguments or a promise that resolves to the arguments array. The keys for this object identify the function name on the IPFS node that this function should be run before. e.g.

    ```js
    createProxyServer(getIpfs, {
      pre: {
        'files.add' (...args) {
          // Alter the args in some way...
          return args
        }
      }
    })
    ```

    If `options.pre` is a function it should create and return a pre-function (or `null`) for the passed function name. e.g.

    ```js
    createProxyServer(getIpfs, {
      pre: (fnName) => (...args) => {
        // Alter the args in some way...
        return args
      }
    })
    ```

Returns an IPFS proxy server instance.

#### `closeProxyServer(server)`

Close the passed proxy server (removes all listeners for `postMessage` message events).

* `server` - a proxy server created by `createProxyServer`

Returns a `Promise` that resolves once the server is fully closed.

#### `createProxyClient([options])`

Create a proxy client to the proxy server.

* `options.postMessage` - function that posts a message (default `window.postMessage`)
* `options.targetOrigin` - passed to postMessage. See [postMessage docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for more info (default `'*'`)
* `options.addListener` - function that adds a listener (default `window.addEventListener`)
* `options.removeListener` - function that removes a listener (default `window.removeEventListener`)
* `options.getMessageData` - a function that extracts data from the event object passed to a `message` event handler (default `(e) => e.data`)

Returns an IPFS proxy client instance.

## Current status

```
$ npm run test:integration:node:js

.bitswap.stat
  ✓ should get bitswap stats
  ✓ should get bitswap stats (promised)
  ✓ should not get bitswap stats when offline

.bitswap.wantlist
  ✓ should get the wantlist
  ✓ should get the wantlist by peer ID for a diffreent node
  ✓ should not get the wantlist when offline

.block.put
  ✓ should put a buffer, using defaults
  ✓ should put a buffer, using CID
  ✓ should put a buffer, using options
  ✓ should put a Block instance
  ✓ should error with array of blocks

.block.get
  ✓ should get by CID object
  ✓ should get by CID in string
  ✓ should get an empty block

.block.stat
  ✓ should stat by CID

.bootstrap.add
  ✓ should return an error when called with an invalid arg
  ✓ should return a list containing the bootstrap peer when called with a valid arg (ip4)
  ✓ should return a list of bootstrap peers when called with the default option

.bootstrap.list
  ✓ should return a list of peers

.bootstrap.rm
  ✓ should return an error when called with an invalid arg
  ✓ should return an empty list because no peers removed when called without an arg or options
  ✓ should return a list containing the peer removed when called with a valid arg (ip4)
  ✓ should return a list of all peers removed when all option is passed

.config.get
  ✓ should retrieve the whole config
  ✓ should retrieve the whole config (promised)
  ✓ should retrieve a value through a key
  ✓ should retrieve a value through a nested key
  ✓ should fail on non valid key
  ✓ should fail on non existent key

.config.set
  ✓ should set a new key
  ✓ should set a new key (promised)
  ✓ should set an already existing key
  ✓ should set a JSON object
  ✓ should fail on non valid key
  ✓ should fail on non valid value

.config.replace
  ✓ should replace the whole config
  ✓ should replace to empty config

.dag.get
  ✓ should get a dag-pb node
  ✓ should get a dag-cbor node
  ✓ should get a dag-pb node with path
  ✓ should get a dag-pb node local value
  - should get a dag-pb node value one level deep
  - should get a dag-pb node value two levels deep
  ✓ should get a dag-cbor node with path
  ✓ should get a dag-cbor node local value
  - should get dag-cbor node value one level deep
  - should get dag-cbor node value two levels deep
  - should get dag-cbor value via dag-pb node
  ✓ should get dag-pb value via dag-cbor node
  ✓ should get by CID string
  ✓ should get by CID string + path

.dag.put
  ✓ should put dag-pb with default hash func (sha2-256)
  ✓ should put dag-pb with custom hash func (sha3-512)
  ✓ should put dag-cbor with default hash func (sha2-256)
  ✓ should put dag-cbor with custom hash func (sha3-512)
  ✓ should return the cid
  ✓ should not fail when calling put without options
  ✓ should not fail when calling put without options (promised)
  ✓ should set defaults when calling put without options
  ✓ should set defaults when calling put without options (promised)
  ✓ should override hash algoritm default and resolve with it
  - should put by passing the cid instead of format and hashAlg

.dag.tree
  ✓ should get tree with CID
  ✓ should get tree with CID and path
  ✓ should get tree with CID and path as String
  ✓ should get tree with CID recursive (accross different formats)
  ✓ should get tree with CID and path recursive

.dht.get (TODO: DHT is not implemented in js-ipfs yet!)
  - should error when getting a non-existent key from the DHT
  - should get a value after it was put on another node

.dht.put (TODO: DHT is not implemented in js-ipfs yet!)
  - should put a value on the DHT

.dht.findpeer (TODO: DHT is not implemented in js-ipfs yet!)
  - should find other peers
  - should fail to find other peer if peer does not exist

.dht.provide (TODO: DHT is not implemented in js-ipfs yet!)
  - should provide local CID
  - should not provide if block not found locally
  - should allow multiple CIDs to be passed
  - should provide a CIDv1
  - should error on non CID arg
  - should error on array containing non CID arg

.dht.findprovs (TODO: DHT is not implemented in js-ipfs yet!)
  - should provide from one node and find it through another node
  - should take options to override timeout config

.dht.query (TODO: DHT is not implemented in js-ipfs yet!)
  - should return the other node in the query

.files.add
  ✓ should add a Buffer
  ✓ should add a Buffer (promised)
  ✓ should add a BIG Buffer
  ✓ should add a BIG Buffer with progress enabled
  ✓ should add a Buffer as tuple
  ✓ should not be able to add by path
  ✓ should add readable stream
  ✓ should add array of objects with readable stream content
  ✓ should add pull stream
  - should add pull stream (promised) (https://github.com/ipfs/js-ipfs/issues/1574)
  ✓ should add array of objects with pull stream content (promised)
  ✓ should add a nested directory as array of tupples
  ✓ should add a nested directory as array of tupples with progress
  ✓ should fail when passed invalid input
  ✓ should wrap content in a directory
  ✓ should add with only-hash=true (promised)

.files.addReadableStream
  ✓ should add readable stream of valid files and dirs

.files.addPullStream
  ✓ should add pull stream of valid files and dirs
  ✓ should add with object chunks and pull stream content

.files.cat
  ✓ should cat with a base58 string encoded multihash
  ✓ should cat with a base58 string encoded multihash (promised)
  ✓ should cat with a Buffer multihash
  ✓ should cat with a CID object
  ✓ should cat a BIG file
  ✓ should cat with IPFS path
  ✓ should cat with IPFS path, nested value
  ✓ should error on invalid key (promised)
  ✓ should error on unknown path (promised)
  ✓ should error on dir path (promised)
  ✓ should export a chunk of a file

.files.catReadableStream
  ✓ should return a Readable Stream for a CID
  ✓ should export a chunk of a file in a Readable Stream

.files.catPullStream
  ✓ should return a Pull Stream for a CID
  ✓ should export a chunk of a file in a Pull Stream

.files.get
  ✓ should get with a base58 encoded multihash
  ✓ should get with a base58 encoded multihash (promised)
  ✓ should get with a Buffer multihash
  ✓ should get a BIG file
  ✓ should get a directory
  ✓ should get with ipfs path, as object and nested value
  ✓ should get with ipfs path, as array and nested value
  ✓ should error on invalid key

.files.getReadableStream
  ✓ should return a Readable Stream of Readable Streams

.files.getPullStream
  ✓ should return a Pull Stream of Pull Streams

.files.mkdir
  ✓ should make directory on root
  ✓ should make directory and its parents
  ✓ should not make already existent directory

.files.write
  ✓ should not write to non existent file, expect error
  ✓ should write to non existent file with create flag
  ✓ should write to deeply nested non existent file with create and parents flags

.files.cp
  ✓ should copy file, expect error
  ✓ should copy file, expect no error
  ✓ should copy dir, expect error
  ✓ should copy dir, expect no error

.files.mv
  ✓ should not move not found file/dir, expect error
  ✓ should move file, expect no error
  ✓ should move dir, expect no error

.files.rm
  ✓ should not remove not found file/dir, expect error
  ✓ should remove file, expect no error
  ✓ should remove dir, expect no error

.files.stat
  ✓ should not stat not found file/dir, expect error
  - should stat file (https://github.com/ipfs/interface-ipfs-core/pull/365)
  - should stat dir (https://github.com/ipfs/interface-ipfs-core/pull/365)
  - should stat withLocal file
  - should stat withLocal dir
  - should stat outside of mfs (https://github.com/ipfs/interface-ipfs-core/pull/365)

.files.read
  ✓ should not read not found, expect error
  ✓ should read file

.files.readReadableStream
  ✓ should not read not found, expect error
  ✓ should read file

.files.readPullStream
  ✓ should not read not found, expect error
  ✓ should read file

.files.ls
  ✓ should not ls not found file/dir, expect error
  ✓ should ls directory
  ✓ should ls -l directory

.files.flush
  ✓ should not flush not found file/dir, expect error
  ✓ should flush root
  ✓ should flush specific dir

.key.gen
  ✓ should generate a new rsa key

.key.list
  ✓ should list all the keys

.key.rename
  ✓ should rename a key

.key.rm
  ✓ should rm a key

.key.export
  ✓ should export "self" key

.key.import
  ✓ should import an exported key

.ls
  ✓ should ls with a base58 encoded CID
  ✓ should correctly handle a non existing hash
  ✓ should correctly handle a non exiting path

.lsReadableStream
  ✓ should readable stream ls with a base58 encoded CID

.lsPullStream
  ✓ should pull stream ls with a base58 encoded CID

.id
  ✓ should get the node ID
  ✓ should get the node ID (promised)

.version
  ✓ should get the node version
  ✓ should get the node version (promised)

.dns
  ✓ should resolve a DNS link

.stop
  ✓ should stop the node

.resolve
  ✓ should resolve an IPFS hash
  ✓ should resolve an IPFS path link
  ✓ should not resolve an IPFS path non-link
  - should resolve an IPNS DNS link (TODO IPNS not implemented yet)
  - should resolve IPNS link recursively (TODO IPNS not implemented yet)

.name.publish
  ✓ should publish an IPNS record with the default params
  ✓ should publish correctly when the file was not added but resolve is disabled
  ✓ should publish with a key received as param, instead of using the key of the node

.name.resolve
  ✓ should resolve a record with the default params after a publish
  ✓ should not get the entry if its validity time expired
  ✓ should recursively resolve to an IPFS hash

.object.new
  ✓ should create a new object with no template
  ✓ should create a new object with no template (promised)
  ✓ should create a new object with unixfs-dir template

.object.put
  ✓ should put an object
  ✓ should put an object (promised)
  ✓ should put a JSON encoded Buffer
  ✓ should put a Protobuf encoded Buffer
  ✓ should put a Buffer as data
  ✓ should put a Protobuf DAGNode
  ✓ should fail if a string is passed
  ✓ should put a Protobuf DAGNode with a link

.object.get
  ✓ should get object by multihash
  ✓ should get object by multihash (promised)
  ✓ should get object by multihash string
  ✓ should get object by multihash string (promised)
  ✓ should get object with links by multihash string
  ✓ should get object by base58 encoded multihash
  ✓ should get object by base58 encoded multihash string
  ✓ supplies unadulterated data

.object.data
  ✓ should get data by multihash
  ✓ should get data by multihash (promised)
  ✓ should get data by base58 encoded multihash
  ✓ should get data by base58 encoded multihash string

.object.links
  ✓ should get empty links by multihash
  ✓ should get empty links by multihash (promised)
  ✓ should get links by multihash
  ✓ should get links by base58 encoded multihash
  ✓ should get links by base58 encoded multihash string

.object.stat
  ✓ should get stats by multihash
  ✓ should get stats for object by multihash (promised)
  ✓ should get stats for object with links by multihash
  ✓ should get stats by base58 encoded multihash
  ✓ should get stats by base58 encoded multihash string

.object.patch.addLink
  ✓ should add a link to an existing node
  ✓ should add a link to an existing node (promised)

.object.patch.rmLink
  ✓ should remove a link from an existing node
  ✓ should remove a link from an existing node (promised)

.object.patch.appendData
  ✓ should append data to an existing node
  ✓ should append data to an existing node (promised)

.object.patch.setData
  ✓ should set data for an existing node
  ✓ should set data for an existing node (promised)

.pin.ls
  ✓ should list recursive pins
  ✓ should list indirect pins
  ✓ should list pins
  ✓ should list pins (promised)
  ✓ should list direct pins
  ✓ should list pins for a specific hash
  ✓ should list pins for a specific hash (promised)

.pin.rm
  ✓ should remove a recursive pin
  ✓ should remove a direct pin (promised)

.pin.add
  ✓ should add a pin
  ✓ should add a pin (promised)

.ping
  ✓ should send the specified number of packets
  - should fail when pinging an unknown peer (Timing out)
  ✓ should fail when pinging an invalid peer

.pingPullStream
  ✓ should send the specified number of packets over pull stream
  - should fail when pinging an unknown peer over pull stream (Timing out)
  ✓ should fail when pinging an invalid peer over pull stream

.pingReadableStream
  ✓ should send the specified number of packets over readable stream
  - should fail when pinging an unknown peer over readable stream (Timing out)
  ✓ should fail when pinging an invalid peer over readable stream

.pubsub.publish
  ✓ should error on string messags
  ✓ should publish message from buffer
  ✓ should publish 10 times within time limit

.pubsub.subscribe
  single node
    ✓ should subscribe to one topic
    ✓ should subscribe to one topic (promised)
    ✓ should subscribe to one topic with options
    ✓ should subscribe to one topic with options (promised)
    ✓ should subscribe to topic multiple times with different handlers
    ✓ should allow discover option to be passed
  multiple connected nodes
    ✓ should receive messages from a different node
    ✓ should round trip a non-utf8 binary buffer
    ✓ should receive multiple messages
Send/Receive 100 messages took: 86 ms, 1162 ops / s
    ✓ send/receive 100 messages

.pubsub.unsubscribe
  ✓ should subscribe and unsubscribe 10 times

.pubsub.peers
  ✓ should not error when not subscribed to a topic
  ✓ should not return extra peers
  ✓ should return peers for a topic - one peer
  ✓ should return peers for a topic - multiple peers

.pubsub.ls
  ✓ should return an empty list when no topics are subscribed
  ✓ should return a list with 1 subscribed topic
  ✓ should return a list with 3 subscribed topics

.repo.version
  ✓ should get the repo version
  ✓ should get the repo version (promised)

.repo.stat
  ✓ should get repo stats
  ✓ should get repo stats (promised)

.repo.gc (TODO: repo.gc is not implemented in js-ipfs yet!)
  - should run garbage collection
  - should run garbage collection (promised)

.stats.bitswap
  ✓ should get bitswap stats
  ✓ should get bitswap stats (promised)

.stats.bw
  ✓ should get bandwidth stats
  ✓ should get bandwidth stats (promised)

.stats.bwPullStream
  ✓ should get bandwidth stats over pull stream

.stats.bwReadableStream
  ✓ should get bandwidth stats over readable stream

.stats.repo
  ✓ should get repo stats
  ✓ should get repo stats (promised)

.swarm.connect
  ✓ should connect to a peer
  ✓ should connect to a peer (promised)

.swarm.peers
  ✓ should list peers this node is connected to
  ✓ should list peers this node is connected to (promised)
  ✓ should list peers this node is connected to with verbose option
  ✓ should list peers only once
  ✓ should list peers only once even if they have multiple addresses

.swarm.addrs
  - should get a list of node addresses (Returning empty array)
  - should get a list of node addresses (promised) (Returning empty array)

.swarm.localAddrs
  ✓ should list local addresses the node is listening on
  ✓ should list local addresses the node is listening on (promised)

.swarm.disconnect
  ✓ should disconnect from a peer
  ✓ should disconnect from a peer (promised)

.types (FIXME: currently failing)
  - should have a types object with the required values

.util (FIXME: currently failing)
  - should have a util object with the required values


261 passing (2m)
37 pending
```

## Caveats

### Progress option

The progress option for `files.add` currently tracks progress of data streamed to the IPFS node.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/ipfs-shipyard/ipfs-postmsg-proxy/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Protocol Labs
