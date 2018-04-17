const structuredClone = require('realistic-structured-clone')

// Structured clone doesn't log the object that it was attempting to clone!
function clone (obj) {
  try {
    // obj = JSON.parse(JSON.stringify(obj))
    obj = structuredClone(obj)
  } catch (err) {
    console.error('Failed to clone object', obj)
    throw err
  }
  return obj
}

module.exports = function mockWindow () {
  const win = {
    listeners: [],
    addEventListener: (_, listener) => win.listeners.push(listener),
    removeEventListener (_, listener) {
      win.listeners = win.listeners.filter(l => l !== listener)
    },
    postMessage (data) {
      data = clone(data)
      process.nextTick(() => win.listeners.forEach(l => l({ data })))
    }
  }
  return win
}
