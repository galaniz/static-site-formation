/**
 * Utils - require file
 */

/* Imports */

import { resolve } from 'node:path'

/**
 * Function - dynamic require file
 *
 * @param {string} path
 * @param {boolean} local
 * @return {*}
 */

const requireFile = (path: string = '', local: boolean = true): any => {
  if (path === '') {
    return false
  }

  let p = path

  if (local) {
    p = resolve(path)
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(p)
}

/* Exports */

export default requireFile
