/**
 * Utils - write store files
 */

import { config } from '../../config'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * Function - write files from config store object
 *
 * @return {void}
 */

const writeStoreFiles = async (): Promise<void> => {
  try {
    const files = config.store.files
    const fileKeys = Object.keys(files)

    if (fileKeys.length > 0) {
      for (let i = 0; i < fileKeys.length; i += 1) {
        const file: Formation.File = files[fileKeys[i]]
        const path = `${config.store.dir}${file.name}`

        await writeFile(resolve(path), file.data)

        console.info(`Successfully wrote ${path}`)
      }
    }
  } catch (error) {
    console.error('Error writing store files: ', error)
  }
}

/* Exports */

export default writeStoreFiles
