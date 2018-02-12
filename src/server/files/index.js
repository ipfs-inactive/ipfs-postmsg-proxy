import createFilesAdd from './add'
import createFilesCat from './cat'
import createFilesCp from './cp'
import createFilesGet from './get'
import createFilesLs from './ls'
import createFilesMkdir from './mkdir'
import createFilesMv from './mv'
import createFilesRm from './rm'
import createFilesWrite from './write'

export default function (getIpfs, opts) {
  return Object.assign(
    createFilesAdd(getIpfs, opts),
    createFilesCat(getIpfs, opts),
    createFilesCp(getIpfs, opts),
    createFilesGet(getIpfs, opts),
    createFilesLs(getIpfs, opts),
    createFilesMkdir(getIpfs, opts),
    createFilesMv(getIpfs, opts),
    createFilesRm(getIpfs, opts),
    createFilesWrite(getIpfs, opts)
  )
}
