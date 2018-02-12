import createFilesAdd from './add'
import createFilesCat from './cat'
import createFilesCp from './cp'
import createFilesGet from './get'
import createFilesLs from './ls'
import createFilesMkdir from './mkdir'
import createFilesMv from './mv'
import createFilesWrite from './write'

export default function (opts) {
  return Object.assign(
    createFilesAdd(opts),
    createFilesCat(opts),
    createFilesCp(opts),
    createFilesGet(opts),
    createFilesLs(opts),
    createFilesMkdir(opts),
    createFilesMv(opts),
    createFilesWrite(opts)
  )
}
