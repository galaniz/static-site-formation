/**
 * Utils - write store files
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import config from '../../config'

/**
 * Function - write files from config store object
 *
 * @return {void}
 */

const writeStoreFiles = async (): Promise<void> => {
  try {
    const files = config.store.files
    const fileKeys = Object.keys(files)

    await mkdir(resolve(config.store.dir), { recursive: true })

    if (fileKeys.length > 0) {
      for (let i = 0; i < fileKeys.length; i += 1) {
        const file: FRM.StoreFile = files[fileKeys[i]]
        const path = resolve(config.store.dir, file.name)

        await writeFile(path, file.data)

        console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
      }
    }
  } catch (error) {
    console.error(config.console.red, '[SSF] Error writing store files: ', error)
  }
}

/* Exports */

export default writeStoreFiles
