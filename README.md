# ipfs-postmsg-proxy

> Proxy to an IPFS over window.postMessage

```
Web page                                               Browser extension
+---------------+-----------------+                    +-------------------+----------------+
|               |                 |                    |                   |                |
|               |                 |                    |                   |                |
|               |                 | window.postMessage |                   |                |
| window.ipfs   +->  postmsg-rpc  +--------------------->  postmsg-rpc     +->  js-ipfs /   |
|             <-+    call stubs  <---------------------+   exposed api   <-+    js-ipfs-api |
|               |                 |                    |                   |                |
|               |                 |                    |                   |                |
|               |                 |                    |                   |                |
+---------------+--------^--------+                    +-------------------+----------------+
                         |
                         +
                interface-ipfs-core
```

We're using `interface-ipfs-core` to test our call stubs which are hooked up to a `js-ipfs`/`js-ipfs-api` on the other end. If the tests pass we know that the proxy is doing a good job of passing messages over the boundary.

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
    ✓ finds other peers (52ms)
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
    ✓ a BIG buffer (636ms)
    ✓ a BIG buffer with progress enabled (139ms)
    ✓ a Buffer as tuple
    ✓ add by path fails
    ✓ a Readable Stream
    ✓ add a nested directory as array of tupples (78ms)
    ✓ add a nested directory as array of tuppled with progress
    ✓ fails in invalid input
    ✓ Promise test
  .addReadableStream
    1) stream of valid files and dirs
  .addPullStream
    2) stream of valid files and dirs
  .cat
    ✓ with a base58 string encoded multihash
    ✓ with a multihash
    ✓ streams a large file (360ms)
    ✓ with ipfs path
    ✓ with ipfs path, nested value
    ✓ Promise test
    ✓ errors on invalid key
    ✓ errors on unknown path
    ✓ errors on dir path
  .catReadableStream
    3) returns a Readable Stream for a cid
  .catPullStream
    4) returns a Pull Stream for a cid
  .get
    ✓ with a base58 encoded multihash
    ✓ with a multihash
    ✓ large file (328ms)
    ✓ directory
    ✓ with ipfs path, nested value
    ✓ Promise test
    ✓ errors on invalid key
  .getReadableStream
    5) returns a Readable Stream of Readable Streams
  .getPullStream
    6) returns a Pull Stream of Pull Streams
  .ls
    ✓ with a base58 encoded CID
    ✓ should correctly handle a non existing hash
    ✓ should correctly handle a non exiting path
  .lsReadableStream
    7) with a base58 encoded CID
  .lsPullStream
    8) with a base58 encoded CID

.key
  .gen
    9) creates a new rsa key
  .list
    10) lists all the keys
    ✓ contains the created keys
  .rename
    11) "before all" hook
  .rm
    12) removes a key
    13) does not contain the removed name

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
    14) .ls type recursive
    - .ls type indirect
    15) .rm
    16) .add
    17) .ls
    18) .ls type direct
    19) .ls for a specific hash
  promise API
    20) .add
    21) .ls
    22) .ls hash
    23) .rm

.pubsub
  single node
    .publish
      ✓ errors on string messags
      ✓ message from buffer
    .subscribe
      24) to one topic
      25) to one topic with Promise
      26) to one topic with options and Promise
      27) attaches multiple event listeners
      28) discover options
  multiple nodes connected
    .peers
      ✓ does not error when not subscribed to a topic
      29) doesn't return extra peers
      30) returns peers for a topic - one peer
      31) lists peers for a topic - multiple peers
    .ls
      ✓ empty() list when no topics are subscribed
      32) list with 1 subscribed topic
      33) list with 3 subscribed topics
    multiple nodes
      34) receive messages from different node
      35) round trips a non-utf8 binary buffer correctly
      36) receive multiple messages
    load tests
      37) "before all" hook
      38) "after all" hook

.swarm
  callback API
    ✓ .connect
    ✓ time (1504ms)
    ✓ .addrs
    ✓ .localAddrs
    ✓ .disconnect
    .peers
      ✓ default
      ✓ verbose
      Shows connected peers only once
        ✓ Connecting two peers with one address each (1743ms)
        ✓ Connecting two peers with two addresses each (1667ms)
  promise API
    ✓ .connect
    ✓ time (1505ms)
    ✓ .peers
    ✓ .addrs
    ✓ .localAddrs
    ✓ .disconnect


137 passing (15s)
14 pending
38 failing
```
