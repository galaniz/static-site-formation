/**
 * Utils - get file data
 */

/* Imports */

import { config } from '../../config'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'

/**
 * Function -
 *
 * @param {string} key
 * @param {object} params
 * @param {function} cache - external module
 * @return {object}
 */

interface Params {
  all?: boolean
  id?: string
}

const getFileData = async (
  key: string = '',
  params: Params = {},
  cache: Function
): Promise<object> => {
  try {
    /* Key required for cache */

    if (key === '') {
      throw new Error('No key')
    }

    /* Check cache */

    if (typeof cache === 'function') {
      const data = cache(key)

      if (data !== undefined) {
        return data
      }
    }

    /* Params */

    const { all = true, id = '' } = params

    /* Single file */

    const data = {}

    if (id !== '' && !all) {
      const file = await readFile(resolve(`${config.static.dir}${id}.json`), { encoding: 'utf8' })

      if (file !== '') {
        const fileJson = JSON.parse(file)

        if (fileJson !== '') {
          data[id] = fileJson
        }
      }
    }

    /* All files */

    if (id === '' && all) {
      const files = await readdir(config.static.dir)

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]
        const fileExt = extname(file)
        const fileName = basename(file, fileExt)

        if (fileExt === '.json') {
          const fileContents = await readFile(resolve(`${config.static.dir}${file}`), { encoding: 'utf8' })

          if (fileContents !== '') {
            const fileJson = JSON.parse(fileContents)

            if (fileJson !== '') {
              data[fileName] = fileJson
            }
          }
        }
      }
    }

    /* Data not empty check */

    if (Object.keys(data).length > 0) {
      throw new Error('No file data')
    }

    /* Store in cache */

    if (typeof cache === 'function') {
      await cache(data)
    }

    /* Output */

    return data
  } catch (error) {
    console.error('Error getting file data: ', error)

    return {}
  }
}

/* Exports */

export default getFileData
