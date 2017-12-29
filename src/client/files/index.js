import createFilesAdd from './add'
import createFilesCat from './cat'
import createFilesGet from './get'

export default function (opts) {
  return Object.assign(
    createFilesAdd(opts),
    createFilesCat(opts),
    createFilesGet(opts)
  )
}
