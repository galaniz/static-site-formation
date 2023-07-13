/**
 * Utils - get all contentful data
 */

/* Imports */

import config from '../../config'
import requireFile from '../require-file'
import getContentfulData from '../get-contentful-data'

/**
 * Function - fetch data from all content types or single entry if serverless
 *
 * @param {object} args
 * @param {object} args.serverlessData
 * @param {object} args.previewData
 * @param {function} args.filterData
 * @param {function} args.filterAllData
 * @param {boolean} args.cache
 * @return {object|undefined}
 */

interface AllContentfulDataArgs {
  serverlessData?: FRM.ServerlessData
  previewData?: FRM.PreviewData
  filterData?: Function
  filterAllData?: Function
  cache?: boolean
}

const getAllContentfulData = async (args: AllContentfulDataArgs): Promise<FRM.AllData | undefined> => {
  const {
    serverlessData,
    previewData,
    filterData,
    filterAllData,
    cache = false
  } = args

  try {
    /* Store all data */

    let allData: FRM.AllData = {
      navigation: [],
      navigationItem: [],
      redirect: [],
      content: {
        page: []
      }
    }

    /* Get single entry data if serverless or preview data */

    let entry: { items?: any[] } | undefined

    if (serverlessData !== undefined || previewData !== undefined) {
      let contentType = ''
      let id = ''

      if (serverlessData !== undefined) {
        const slugsJson = requireFile(`${config.store.dir}${config.store.files.slugs.name}`)
        const path = serverlessData.path

        if (slugsJson?.[path] !== undefined) {
          const item = slugsJson[path]

          id = item.id
          contentType = item.contentType
        }
      }

      if (previewData !== undefined) {
        id = previewData.id
        contentType = previewData.contentType
      }

      if (id !== '') {
        const key = `serverless_${id}`
        const params = {
          'sys.id': id,
          include: 10
        }

        entry = await getContentfulData(key, params, cache)

        if (entry?.items !== undefined) {
          allData.content[contentType] = entry.items
        }
      }
    }

    /* Get partial data - not serverless */

    if (serverlessData === undefined || entry === undefined) {
      const partial = config.contentTypes.partial

      for (let i = 0; i < partial.length; i += 1) {
        const contentType = partial[i]

        allData[contentType] = []

        const key = `all_${contentType}`
        const params = {
          content_type: contentType,
          include: 5
        }

        let data = await getContentfulData(key, params, cache)

        if (typeof filterData === 'function') {
          data = filterData(data, serverlessData, previewData)
        }

        if (data?.items !== undefined) {
          allData[contentType].push(data.items)
        }
      }
    }

    /* Get whole data (for page generation) - not serverless or preview */

    if ((serverlessData === undefined && previewData === undefined) || entry === undefined) {
      const whole = config.contentTypes.whole

      for (let i = 0; i < whole.length; i += 1) {
        const contentType = whole[i]

        allData.content[contentType] = []

        const key = `all_${contentType}`
        const params = {
          content_type: contentType,
          include: 10
        }

        let data = await getContentfulData(key, params, cache)

        if (typeof filterData === 'function') {
          data = filterData(data, serverlessData, previewData)
        }

        if (data?.items !== undefined) {
          allData.content[contentType].push(data.items)
        }
      }
    }

    /* Filter all data */

    if (typeof filterAllData === 'function') {
      allData = filterAllData(allData, serverlessData, previewData)
    }

    /* Output */

    return allData
  } catch (error) {
    console.error(config.console.red, '[SSF] Error getting all Contentful data: ', error)
  }
}

/* Exports */

export default getAllContentfulData
