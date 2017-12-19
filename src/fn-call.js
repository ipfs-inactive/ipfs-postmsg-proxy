// Alter the arguments before they are sent to the server
export function preCall (preFn, callFn) {
  return (...args) => {
    args = preFn(...args)
    // Args can be a promise which should be resolved before callFn is called
    if (args.then) return args.then((args) => callFn(...args))
    return callFn(...args)
  }
}

// Alter the repsonse before it is passed back to the caller
export function postCall (callFn, postFn) {
  return (...args) => callFn(...args).then((res) => postFn(res))
}
