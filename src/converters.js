import isTypedArray from 'is-typedarray'

export function convertTypedArraysToBuffers (obj) {
  Object.keys(obj).forEach((key) => {
    if (isTypedArray(obj[key])) {
      obj[key] = Buffer.from(obj[key])
    } else if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      obj[key] = convertTypedArraysToBuffers(obj[key])
    }
  })
  return obj
}
