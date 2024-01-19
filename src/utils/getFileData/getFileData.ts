/**
 * Utils - Get File Data
 */

/* Imports */

import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import { applyFilters } from '../../utils/filters/filters'
import { config } from '../../config/config'

/**
 * Function - get data from file or cache
 *
 * @param {string} key
 * @param {object} params
 * @return {object}
 */

interface FileDataParams {
  all?: boolean
  id?: string
}

const getFileData = async (
  key: string = '',
  params: FileDataParams = {}
): Promise<object> => {
  try {
    /* Key required for cache */

    if (key === '') {
      throw new Error('No key')
    }

    /* Check cache */

    if (config.env.cache) {
      let cacheData: FRM.AnyObject = {}

      const cacheDataFilterArgs: FRM.CacheDataFilterArgs = {
        key,
        type: 'get'
      }

      cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs)

      if (Object.keys(cacheData).length > 0) {
        return structuredClone(cacheData)
      }
    }

    /* Params */

    const { all = true, id = '' } = params

    /* Single file */

    const data: FRM.AnyObject = {}

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

    if (config.env.cache) {
      const cacheDataFilterArgs: FRM.CacheDataFilterArgs = {
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
