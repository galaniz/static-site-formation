/**
 * Utils - write redirects file
 */

import { config } from '../../config'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * Function - write redirects file from config redirects array
 *
 * @return {void}
 */

const writeRedirectsFile = async (): Promise<void> => {
  try {
    const redirects = config.redirects.data
    const path = config.redirects.file

    let redirectsData = ''

    if (redirects.length > 0) {
      redirects.forEach((r) => {
        redirectsData += `${r}\n`
      })
    }

    await writeFile(resolve(path), redirectsData)

    console.info(`Successfully wrote ${path}`)
  } catch (error) {
    console.error('Error writing redirects file: ', error)
  }
}

/* Exports */

export default writeRedirectsFile
