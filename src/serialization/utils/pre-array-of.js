export default function preArrayOf (index, detect, convert) {
  return (...args) => {
    if (Array.isArray(args[index])) {
      args[index] = args[index].map((item) => detect(item) ? convert(item) : item)
    }

    return args
  }
}
