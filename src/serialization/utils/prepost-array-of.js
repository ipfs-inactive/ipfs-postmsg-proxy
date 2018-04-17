export function preArrayOf (index, detect, convert) {
  return (...args) => {
    if (Array.isArray(args[index])) {
      args[index] = args[index].map((item) => detect(item) ? convert(item) : item)
    }

    return args
  }
}

// specify falsey prop for root
export function postArrayOf (prop, detect, convert) {
  return (res) => {
    if (prop && res && Array.isArray(res[prop])) {
      res[prop] = res[prop].map((item) => detect(item) ? convert(item) : item)
    } else if (!prop && Array.isArray(res)) {
      res = res.map((item) => detect(item) ? convert(item) : item)
    }

    return res
  }
}
