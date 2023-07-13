/**
 * Utils - get file data
 */

/* Imports */

import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import config from '../../config'
import requireFile from '../../utils/require-file'

/**
 * Function -
 *
 * @param {string} key
 * @param {object} params
 * @param {boolean} cache
 * @return {object}
 */

interface FileDataParams {
  all?: boolean
  id?: string
}

const getFileData = async (
  key: string = '',
  params: FileDataParams = {},
  cache: boolean = false
): Promise<object> => {
  try {
    /* Key required for cache */

    if (key === '') {
      throw new Error('No key')
    }

    /* Check cache */

    let cacheModule: Function | null = null

    if (cache) {
      cacheModule = requireFile(config.modules.cache?.path, config.modules.cache?.local)

      if (cacheModule !== null && typeof cacheModule === 'function') {
        const data = cacheModule(key)

        if (data !== undefined) {
          return data
        }
      }
    }

    /* Params */

    const { all = true, id = '' } = params

    /* Single file */

    const data = {}

    if (id !== '' && !all) {
      const file = await readFile(resolve(config.static.dir, `${id}.json`), { encoding: 'utf8' })

      if (file !== '') {
        const fileJson = JSON.parse(file)

        if (fileJson !== '') {
          data[id] = fileJson
        }
      }
    }

    /* All files */

    if (id === '' && all) {
      const files = await readdir(resolve(config.static.dir))

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]
        const fileExt = extname(file)
        const fileName = basename(file, fileExt)

        if (fileExt === '.json') {
          const fileContents = await readFile(resolve(config.static.dir, file), { encoding: 'utf8' })

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

    if (Object.keys(data).length === 0) {
      throw new Error('No file data')
    }

    /* Store in cache */

    if (cacheModule !== null && typeof cacheModule === 'function') {
      await cacheModule(data)
    }

    /* Output */

    return data
  } catch (error) {
    console.error(config.console.red, '[SSF] Error getting file data: ', error)

    return {}
  }
}

/* Exports */

export default getFileData
