// Convert object or array values
export default function convertValues (obj, detect, convert) {
  if (!isObjectOrArray(obj)) return obj

  if (Array.isArray(obj)) {
    return obj.map((value, i) => detect(value) ? convert(value) : convertValues(value, detect, convert))
  }

  return Object.keys(obj).reduce((clone, key) => {
    clone[key] = detect(obj[key]) ? convert(obj[key]) : convertValues(obj[key], detect, convert)
    return clone
  }, {})
}

function isObjectOrArray (obj) {
  const type = Object.prototype.toString.call(obj)
  return type === '[object Object]' || type === '[object Array]'
}
