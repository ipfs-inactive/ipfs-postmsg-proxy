import createFilesAdd from './add'
import createFilesCat from './cat'
import createFilesGet from './get'
import createFilesLs from './ls'

export default function (getIpfs, opts) {
  return Object.assign(
    createFilesAdd(getIpfs, opts),
    createFilesCat(getIpfs, opts),
    createFilesGet(getIpfs, opts),
    createFilesLs(getIpfs, opts)
  )
}
