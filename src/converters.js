// Convert object or array values
export function convertValues (obj, detect, convert) {
  if (!isObjectOrArray(obj)) return obj

  if (Array.isArray(obj)) {
    return obj.map((value) => detect(value) ? convert(value) : convertValues(value))
  }

  return Object.keys(obj).reduce((clone, key) => {
    if (detect(obj[key])) {
      clone[key] = convert(obj[key])
    } else {
      clone[key] = convertValues(obj[key], detect, convert)
    }
    return clone
  }, {})
}

function isObjectOrArray (obj) {
  const type = Object.prototype.toString.call(obj)
  return type === '[object Object]' || type === '[object Array]'
}
