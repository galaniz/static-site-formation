/**
 * Utils - Get All Contentful Data
 */

/* Imports */

import type { AllContentfulDataArgs } from './getAllContentfulDataTypes'
import type { Generic } from '../../global/globalTypes'
import type { RenderAllData } from '../../render/RenderTypes'
import { config } from '../../config/config'
import { getContentfulData } from '../getContentfulData/getContentfulData'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'

/**
 * Function - fetch data from all content types or single entry if serverless
 *
 * @param {AllContentfulDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllContentfulData = async (args: AllContentfulDataArgs = {}): Promise<RenderAllData | undefined> => {
  const {
    serverlessData,
    previewData,
    filterData,
    filterAllData
  } = args

  try {
    /* Store all data */

    let allData: RenderAllData = {
      navigation: [],
      navigationItem: [],
      redirect: [],
      content: {
        page: []
      }
    }

    /* Get single entry data if serverless or preview data */

    let entry: { items?: Generic[] } | undefined

    if (serverlessData !== undefined || previewData !== undefined) {
      let contentType = ''
      let id = ''

      if (serverlessData !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const slugsJson = require(`${config.store.dir}${config.store.files.slugs.name}`)
        const path = serverlessData.path

        if (isObjectStrict(slugsJson)) {
          const item = slugsJson[path]

          if (isObjectStrict(item)) {
            id = isStringStrict(item.id) ? item.id : ''
            contentType = isStringStrict(item.contentType) ? item.contentType : ''
          }
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

        entry = await getContentfulData(key, params)

        if (entry.items !== undefined) {
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
          content_type: contentType
        }

        let data = await getContentfulData(key, params)

        if (typeof filterData === 'function') {
          data = filterData(data, serverlessData, previewData)
        }

        if (data.items !== undefined) {
          allData[contentType] = data.items
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

        let data = await getContentfulData(key, params)

        if (typeof filterData === 'function') {
          data = filterData(data, serverlessData, previewData)
        }

        if (data.items !== undefined) {
          allData.content[contentType] = data.items
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

export { getAllContentfulData }
