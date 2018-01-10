'use strict'

const series = require('async/series')
const each = require('async/each')
const hat = require('hat')
const os = require('os')
const path = require('path')

const defaultConfig = require('./default-config.json')
const IPFS = require('ipfs')
const createTempRepo = require('../create-repo-nodejs')

class Factory {
  constructor () {
    this.nodes = []
  }

  /* yields a new started node instance */
  spawnNode (repoPath, suppliedConfig, callback) {
    if (typeof repoPath === 'function') {
      callback = repoPath
      repoPath = undefined
    }

    if (typeof suppliedConfig === 'function') {
      callback = suppliedConfig
      suppliedConfig = {}
    }

    if (!repoPath) {
      repoPath = path.join(os.tmpdir(), '.ipfs-' + hat())
    }

    const config = Object.assign({}, defaultConfig, suppliedConfig)

    const repo = createTempRepo(repoPath)
    const node = new IPFS({
      repo: repo,
      init: { bits: 1024 },
      config: config,
      EXPERIMENTAL: {
        pubsub: true,
        dht: true
      }
    })

    node.once('ready', () => {
      this.nodes.push({ repo: repo, ipfs: node })
      callback(null, node)
    })
  }

  dismantle (callback) {
    series([
      (cb) => each(this.nodes, (el, cb) => el.ipfs.stop(cb), cb),
      (cb) => each(this.nodes, (el, cb) => el.repo.teardown(cb), cb)
    ], callback)
  }
}

module.exports = Factory
