// Alter the arguments before they are sent to the server
export function preCall (preFn, callFn) {
  return (...args) => callFn(...preFn(...args))
}

// Alter the repsonse before it is passed back to the caller
export function postCall (callFn, postFn) {
  return (...args) => callFn(...args).then((res) => postFn(res))
}
