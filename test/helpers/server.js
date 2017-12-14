function close (obj) {
  Object.keys(obj).forEach((k) => {
    if (obj[k].close) {
      obj[k].close()
    } else {
      close(obj[k])
    }
  })
}

exports.closeServer = close
