/**
 * Utils - get all data
 */

/* Imports */

import { config } from '../../config'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import getFileData from '../get-file-data'
import resolveInternalLinks from '../resolve-internal-links'

/**
 * Function - get data from file system/cache if available
 *
 * @param {object} args
 * @param {object} args.resolveProps
 * @param {function} args.beforeDataSet
 * @param {function} args.onDataSet
 * @param {function} args.afterDataSet
 * @param {function} args.cache - external module
 * @return {object|undefined}
 */

interface ResolveProps {
  image: string[]
  data: string[]
}

interface Args {
  resolveProps: ResolveProps
  beforeDataSet: Function
  onDataSet: Function
  afterDataSet: Function
  cache: Function
}

const getAllFileData = async (args: Args): Promise<Formation.AllData | undefined> => {
  const {
    resolveProps = {
      image: ['image'],
      data: ['items', 'internalLink']
    },
    beforeDataSet,
    onDataSet,
    afterDataSet,
    cache
  } = args

  try {
    /* Get data */

    const data = getFileData('all_file_data', { all: true }, cache)

    /* Store all data */

    const allData: Formation.AllData = {
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

    /* Process data */

    if (Object.keys(data).length > 0) {
      let imageData = {}

      if (config.static.image.dataFile !== '') {
        const imageJson = await readFile(resolve(config.static.image.dataFile), { encoding: 'utf8' })

        if (imageJson !== null) {
          imageData = JSON.parse(imageJson)
        }
      }

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

        if (allData[contentType] !== undefined) {
          allData[contentType].push(dd)
        }

        if (allData.content[contentType] !== undefined) {
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

    /* Output */

    return allData
  } catch (error) {
    console.error('Error getting all file data: ', error)
  }
}

/* Exports */

export default getAllFileData
