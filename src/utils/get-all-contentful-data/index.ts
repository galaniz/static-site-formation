/**
 * Utils - get all contentful data
 */

/* Imports */

import { resolve } from 'node:path'
import { config } from '../../config'
import getContentfulData from '../get-contentful-data'

/**
 * Function - fetch data from all content types or single entry if serverless
 *
 * @param {object} args
 * @param {object} args.serverlessData
 * @param {object} args.previewData
 * @param {function} args.resolveResponse - external module
 * @param {function} args.cache - external module
 * @return {object|undefined}
 */

interface Args {
  serverlessData: Formation.ServerlessData
  previewData: Formation.PreviewData
  resolveResponse: Function
  cache: Function
}

const getAllContentfulData = async (args: Args): Promise<Formation.AllData | undefined> => {
  const {
    serverlessData,
    previewData,
    resolveResponse,
    cache
  } = args

  try {
    /* Resolve module required */

    if (resolveResponse === undefined || typeof resolveResponse !== 'function') {
      throw new Error('No resolve response module')
    }

    /* Store all data */

    const allData: Formation.AllData = {
      navigation: [],
      navigationItem: [],
      content: {
        page: []
      }
    }

    /* Get partial data */

    const partial = config.contentTypes.partial

    for (let i = 0; i < partial.length; i += 1) {
      const contentType = partial[i]

      allData[contentType] = []

      const key = `all_${contentType}`
      const params = { content_type: contentType }
      const data = await getContentfulData(key, params, resolveResponse, cache)

      if (data?.items !== undefined) {
        allData[contentType].push(data.items)
      }
    }

    /* Get entry data if serverless or preview data */

    let entry: { items?: any[] } | undefined

    if (serverlessData !== undefined || previewData !== undefined) {
      let contentType = ''
      let id = ''

      if (serverlessData !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const slugsJson = require(resolve(`${config.store.dir}${config.store.files.slugs.name}`))
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

        entry = await getContentfulData(key, params, resolveResponse, cache)

        if (entry?.items !== undefined) {
          allData.content[contentType] = entry.items
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
        const params = { content_type: contentType }
        const data = await getContentfulData(key, params, resolveResponse, cache)

        if (data?.items !== undefined) {
          allData.content[contentType].push(data.items)
        }
      }
    }

    /* Output */

    return allData
  } catch (error) {
    console.error('Error getting all Contentful data: ', error)
  }
}

/* Exports */

export default getAllContentfulData
