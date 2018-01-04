# ipfs-postmsg-proxy

[![Build Status](https://travis-ci.org/tableflip/ipfs-postmsg-proxy.svg?branch=master)](https://travis-ci.org/tableflip/ipfs-postmsg-proxy) [![dependencies Status](https://david-dm.org/tableflip/ipfs-postmsg-proxy/status.svg)](https://david-dm.org/tableflip/ipfs-postmsg-proxy) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
+---------------+--------^--------+                    +-------------------+----------------+
                         |
                         +
                interface-ipfs-core
```

We're using `interface-ipfs-core` to test our call stubs which are hooked up to a `js-ipfs`/`js-ipfs-api` on the other end. If the tests pass we know that the proxy is doing a good job of passing messages over the boundary.

When messages are passed using `window.postMessage` the data that is sent is cloned using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). It allows more things to be cloned than just JSON types but there are some things that _cannot be cloned_ without some prior serialization to a format that _can be cloned_ by the algorithm. For this reason, on both the web page and browser extension side we sometimes manually perform this serialization on arguments and return types.

In the web page, we serialize arguments we know cannot be handled by the structured clone algorithm before stubs are called and we deserialize them in the browser extension before exposed functions are called.

In the browser extension we serialize return values after exposed functions are called and deserialize them in the web page after stubs are called.

The [`fn-call`](./src/fn-call.js) module provides these utility functions.

## Current status

```
.block
  .put
    ✓ a buffer, using defaults
    ✓ a buffer, using CID
    ✓ a buffer, using options
    ✓ a Block instance
    ✓ error with array of blocks
  .get
    ✓ by CID object
    ✓ by CID in Str
  .stat
    ✓ by CID

.config
  .get
    ✓ retrieve the whole config
    ✓ retrieve a value through a key
    ✓ retrieve a value through a nested key
    ✓ fail on non valid key
    ✓ fail on non exist()ent key
    ✓ Promises support
  .set
    ✓ set a new key
    ✓ set an already exist()ing key
    ✓ set a JSON object
    ✓ fail on non valid key
    ✓ fail on non valid value
    ✓ Promises support
  .replace
    - replace the whole config
    - replace to empty config

.dag
  .put
    ✓ dag-pb with default hash func (sha2-256)
    ✓ dag-pb with custom hash func (sha3-512)
    ✓ dag-cbor with default hash func (sha2-256)
    ✓ dag-cbor with custom hash func (sha3-512)
    ✓ dag-cbor node with wrong multicodec
    ✓ returns the cid
    - pass the cid instead of format and hashAlg
  .get
    ✓ dag-pb node
    ✓ dag-cbor node
    with path
      ✓ dag-pb get the node
      ✓ dag-pb local scope
      - dag-pb one level
      - dag-pb two levels
      ✓ dag-cbor get the node
      ✓ dag-cbor local scope
      - dag-cbor one level
      - dag-cbor two levels
      - from dag-pb to dag-cbor
      ✓ from dag-cbor to dag-pb
      ✓ CID String
      ✓ CID String + path
  .tree
    ✓ .tree with CID
    ✓ .tree with CID and path
    ✓ .tree with CID and path as String
    ✓ .tree with CID recursive (accross different formats)
    ✓ .tree with CID and path recursive

.dht
  .get and .put
    ✓ errors when getting a non-existent key from the DHT
    - fetches value after it was put on another node
    ✓ Promises support
  .findpeer
    ✓ finds other peers (59ms)
    - fails to find other peer, if peer doesnt exist()s
  .provide
    ✓ regular
    - recursive
  findprovs
    - basic
    - Promises support
  .query
    ✓ returns the other node in the query

.files
  .add
    ✓ a Buffer
    ✓ a BIG buffer (1024ms)
    1) a BIG buffer with progress enabled
    ✓ a Buffer as tuple
    ✓ add by path fails
    ✓ a Readable Stream
    ✓ add a nested directory as array of tupples (116ms)
    2) add a nested directory as array of tuppled with progress
    ✓ fails in invalid input
    ✓ Promise test
  .addReadableStream
    ✓ stream of valid files and dirs (55ms)
  .addPullStream
    ✓ stream of valid files and dirs (56ms)
  .cat
    ✓ with a base58 string encoded multihash
    ✓ with a multihash
    ✓ streams a large file (362ms)
    ✓ with ipfs path
    ✓ with ipfs path, nested value
    ✓ Promise test
    ✓ errors on invalid key
    ✓ errors on unknown path
    ✓ errors on dir path
  .catReadableStream
    ✓ returns a Readable Stream for a cid (383ms)
  .catPullStream
    ✓ returns a Pull Stream for a cid
  .get
    ✓ with a base58 encoded multihash
    ✓ with a multihash
    ✓ large file (342ms)
    ✓ directory (66ms)
    ✓ with ipfs path, nested value
    ✓ Promise test
    ✓ errors on invalid key
  .getReadableStream
    ✓ returns a Readable Stream of Readable Streams
  .getPullStream
    ✓ returns a Pull Stream of Pull Streams
  .ls
    ✓ with a base58 encoded CID
    ✓ should correctly handle a non existing hash
    ✓ should correctly handle a non exiting path
  .lsReadableStream
    ✓ with a base58 encoded CID
  .lsPullStream
    ✓ with a base58 encoded CID

.key
  .gen
    3) creates a new rsa key
  .list
    4) lists all the keys
    ✓ contains the created keys
  .rename
    5) "before all" hook
  .rm
    6) removes a key
    7) does not contain the removed name
  exchange
    8) exports
    9) imports
    10) removes

.miscellaneous
  ✓ .id
  ✓ .version
  ✓ .id Promises support
  ✓ .version Promises support

.object
  callback API
    .new
      ✓ no layout
      ✓ template unixfs-dir
    .put
      ✓ of object
      ✓ of json encoded buffer
      ✓ of protobuf encoded buffer
      ✓ of buffer treated as Data field
      ✓ of DAGNode
      ✓ fails if String is passed
      ✓ DAGNode with a link
    .get
      ✓ with multihash
      ✓ with multihash (+ links)
      ✓ with multihash base58 encoded
      ✓ with multihash base58 encoded toString
    .data
      ✓ with multihash
      ✓ with multihash base58 encoded
      ✓ with multihash base58 encoded toString
    .links
      ✓ object.links with multihash
      ✓ with multihash (+ links)
      ✓ with multihash base58 encoded
      ✓ with multihash base58 encoded toString
    .stat
      ✓ with multihash
      ✓ with multihash (+ Links)
      ✓ with multihash base58 encoded
      ✓ with multihash base58 encoded toString
    .patch
      ✓ .addLink
      ✓ .rmLink
      ✓ .appendData
      ✓ .setData
  promise API
    ✓ object.new
    ✓ object.put
    ✓ object.get
    ✓ object.get multihash string
    ✓ object.data
    ✓ object.stat
    ✓ object.links
    object.patch
      ✓ .addLink
      ✓ .rmLink
      ✓ .appendData
      ✓ .setData

.pin
  callback API
    11) .ls type recursive
    - .ls type indirect
    12) .rm
    13) .add
    14) .ls
    15) .ls type direct
    16) .ls for a specific hash
  promise API
    17) .add
    18) .ls
    19) .ls hash
    20) .rm

.swarm
  callback API
    ✓ .connect
    ✓ time (1505ms)
    ✓ .addrs
    ✓ .localAddrs
    ✓ .disconnect
    .peers
      ✓ default
      ✓ verbose
      Shows connected peers only once
        ✓ Connecting two peers with one address each (1438ms)
        ✓ Connecting two peers with two addresses each (1940ms)
  promise API
    ✓ .connect
    ✓ time (1502ms)
    ✓ .peers
    ✓ .addrs
    ✓ .localAddrs
    ✓ .disconnect


139 passing (16s)
14 pending
20 failing
```

### Disabled suites

* pubsub

## Caveats

### Streaming APIs

The streaming APIs should work as expected _but_ behind the scenes all data is being buffered into memory.

### Progress option

The progress option for `files.add` is currently unavailable and will cause stubs to throw a "Not Implemented" error if used.
