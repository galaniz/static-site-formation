/**
 * Utils - Get File Data
 */

/* Imports */

import type { Generic } from '../../global/types/types'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import { applyFilters, isObject, isStringStrict } from '../../utils'
import { config } from '../../config/config'

/**
 * @typedef {object} FileDataParams
 * @prop {boolean} [all]
 * @prop {string} [id]
 */
interface FileDataParams {
  all?: boolean
  id?: string
}

/**
 * Function - get data from file or cache
 *
 * @param {string} key
 * @param {FileDataParams} params
 * @return {Promise<Generic>}
 */
const getFileData = async (
  key: string = '',
  params: FileDataParams = {}
): Promise<Generic> => {
  try {
    /* Key required for cache */

    if (!isStringStrict(key)) {
      throw new Error('No key')
    }

    /* Check cache */

    if (config.env.cache) {
      let cacheData: Generic = {}

      const cacheDataFilterArgs = {
        key,
        type: 'get'
      }

      cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs)

      if (isObject(cacheData)) {
        return structuredClone(cacheData)
      }
    }

    /* Params */

    const { all = true, id = '' } = params

    /* Single file */

    const data: Generic = {}

    if (isStringStrict(id) && !all) {
      const file = await readFile(resolve(config.static.dir, `${id}.json`), { encoding: 'utf8' })

      if (isStringStrict(file)) {
        const fileJson = JSON.parse(file)

        if (isObject(fileJson)) {
          data[id] = fileJson
        }
      }
    }

    /* All files */

    if (!isStringStrict(id) && all) {
      const files = await readdir(resolve(config.static.dir))

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]
        const fileExt = extname(file)
        const fileName = basename(file, fileExt)

        if (fileExt === '.json') {
          const fileContents = await readFile(resolve(config.static.dir, file), { encoding: 'utf8' })

          if (isStringStrict(fileContents)) {
            const fileJson = JSON.parse(fileContents)

            if (isObject(fileJson)) {
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

    if (config.env.cache) {
      const cacheDataFilterArgs = {
        key,
        type: 'set',
        data
      }

      await applyFilters('cacheData', data, cacheDataFilterArgs)
    }

    /* Output */

    return data
  } catch (error) {
    console.error(config.console.red, '[SSF] Error getting file data: ', error)

    return {}
  }
}

/* Exports */

export { getFileData }
