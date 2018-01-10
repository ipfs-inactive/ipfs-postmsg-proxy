const preCallNoop = (...args) => args

// Alter the arguments before they are sent to the server
export function preCall (...args) {
  if (args.length > 2) {
    args = [args[0], preCall(...args.slice(1))]
  }

  const preFn = args[0] || preCallNoop
  const callFn = args[1]

  return (...args) => {
    args = preFn(...args)
    // Args can be a promise which should be resolved before callFn is called
    return Promise.resolve(args).then((args) => callFn(...args))
  }
}

// Alter the repsonse before it is passed back to the caller
export function postCall (callFn, postFn) {
  return (...args) => callFn(...args).then((res) => postFn(res))
}
