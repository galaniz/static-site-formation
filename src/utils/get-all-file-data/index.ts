/**
 * Utils - get all data
 */

/* Imports */

import { config } from '../../config'
import { readdir, readFile } from 'node:fs/promises'
import { extname, basename, resolve } from 'node:path'
import resolveInternalLinks from '../resolve-internal-links'

/**
 * Function - get data from file system/cache if available
 *
 * @param {string} key
 * @param {object} params
 * @param {function} cache
 * @param {function} beforeDataSet
 * @param {function} onDataSet
 * @param {function} afterDataSet
 * @return {object}
 */

interface Params {
  all?: boolean
  id?: number
}

interface Resolve {
  image: string[]
  data: string[]
}

interface Return {
  navigation: Formation.Navigation[]
  navigationItem: Formation.NavigationItem[]
  content: {
    page: any[]
    [key: string]: any[]
  }
  [key: string]: any
}

const getAllFileData = async (
  key: string = '',
  params: Params = {},
  resolveProps: Resolve = {
    image: ['image'],
    data: ['items', 'internalLink']
  },
  cache: Function,
  beforeDataSet: Function,
  onDataSet: Function,
  afterDataSet: Function
): Promise<Return | undefined> => {
  try {
    if (key === '') {
      throw new Error('No key')
    }

    /* Check cache */

    if (typeof cache === 'function') {
      const data = cache(key)

      if (data) {
        return data
      }
    }

    /* Fetch new data */

    const {
      all = true,
      id = ''
    } = params

    const data = {}

    if (id !== '') {
      const file = await readFile(resolve(`./json/${id}.json`), { encoding: 'utf8' })

      if (file !== '') {
        const fileJson = JSON.parse(file)

        if (fileJson !== '') {
          data[id] = fileJson
        }
      }
    }

    if (all) {
      const files = await readdir('./json/')

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = extname(file)
        const fileName = basename(file, fileExt)

        if (fileExt !== '.json') {
          continue
        }

        const fileContents = await readFile(resolve(`./json/${file}`), { encoding: 'utf8' })

        if (fileContents !== '') {
          const fileJson = JSON.parse(fileContents)

          if (fileJson !== '') {
            data[fileName] = fileJson
          }
        }
      }
    }

    /* All data */

    const allData: Return = {
      navigation: [],
      navigationItem: [],
      content: {
        page: []
      }
    }

    config.contentTypes.partial.forEach((contentType) => {
      allData[contentType] = []
    })

    config.contentTypes.whole.forEach((contentType) => {
      allData.content[contentType] = []
    })

    if (Object.keys(data).length > 0) {
      const imageJson = await readFile(
        resolve('./src/json/image-data.json'),
        {
          encoding: 'utf8'
        }
      )

      const imageData = imageJson != null ? JSON.parse(imageJson) : {}

      resolveInternalLinks(imageData, data, resolveProps.image)
      resolveInternalLinks(data, data, resolveProps.data)

      if (typeof beforeDataSet === 'function') {
        beforeDataSet(data)
      }

      /* Set content */

      Object.keys(data).forEach((d) => {
        const dd = data[d]
        const { contentType } = dd

        dd.id = d

        if (allData[contentType]) {
          allData[contentType].push(dd)
        }

        if (allData.content[contentType]) {
          allData.content[contentType].push(dd)
        }

        if (typeof onDataSet === 'function') {
          onDataSet(allData, dd)
        }
      })

      if (typeof afterDataSet === 'function') {
        afterDataSet(allData)
      }
    }

    /* Store in cache */

    if (typeof cache === 'function') {
      await cache(allData)
    }

    /* Output */

    return allData
  } catch (error) {
    console.error('Error getting all file data: ', error)
  }
}

/* Exports */

export default getAllFileData
