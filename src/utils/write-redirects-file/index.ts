/**
 * Utils - write redirects file
 */

import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import config from '../../config'

/**
 * Function - write redirects file from config redirects array
 *
 * @return {void}
 */

const writeRedirectsFile = async (): Promise<void> => {
  try {
    const redirects = config.redirects.data
    const path = resolve(config.redirects.file)

    let redirectsData = ''

    if (redirects.length > 0) {
      redirects.forEach((r) => {
        redirectsData += `${r}\n`
      })
    }

    await writeFile(path, redirectsData)

    console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
  } catch (error) {
    console.error(config.console.red, '[SSF] Error writing redirects file: ', error)
  }
}

/* Exports */

export default writeRedirectsFile
