/**
 * Utils - get all file paths
 */

/* Imports */

import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Function - recurse directory to get all file paths in it
 *
 * @param {string} dir
 * @yield {array<string>}
 */

const getAllFilePaths = async function * (dir: string): AsyncIterable<string> {
  const files = await readdir(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory()) {
      yield * getAllFilePaths(join(dir, file.name))
    } else {
      yield join(dir, file.name)
    }
  }
}

/* Exports */

export default getAllFilePaths
