/**
 * Utils - get contentful data
 */

/* Imports */

import resolveResponse from 'contentful-resolve-response'
import { applyFilters } from '../../utils/filters'
import config from '../../config'

/**
 * Function - fetch data from contentful cms or cache
 *
 * @param {string} key
 * @param {object} params
 * @return {object}
 */

interface ContentfulDataParams {
  [key: string]: string | number | boolean
}

interface ContentfulDataItems {
  items?: any[]
  errors?: any[]
  [key: string]: any
}

const getContentfulData = async (
  key: string = '',
  params: ContentfulDataParams = {}
): Promise<ContentfulDataItems> => {
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

      cacheData = applyFilters('cacheData', cacheData, cacheDataFilterArgs)

      if (Object.keys(cacheData).length > 0) {
        return structuredClone(cacheData)
      }
    }

    /* Credentials */

    const credentials: FRM.Cms = config.cms

    const {
      space,
      previewAccessToken,
      deliveryAccessToken,
      previewHost,
      deliveryHost
    } = credentials

    let accessToken = previewAccessToken
    let host = previewHost

    if (config.env.prod) {
      accessToken = deliveryAccessToken
      host = deliveryHost
    }

    if (space === '' || accessToken === '' || host === '') {
      throw new Error('No credentials')
    }

    /* Params */

    let url = `https://${host}/spaces/${space}/environments/master/entries?access_token=${accessToken}`

    Object.keys(params).forEach(p => {
      url += `&${p}=${params[p].toString()}`
    })

    /* New data */

    const resp = await fetch(url)
    const data: ContentfulDataItems = await resp.json()

    if (data?.items !== undefined) {
      data.items = resolveResponse(data)
    } else {
      throw new Error('No items')
    }

    /* Store in cache */

    if (config.env.cache) {
      const cacheDataFilterArgs: FRM.CacheDataFilterArgs = {
        key,
        type: 'set',
        data
      }

      applyFilters('cacheData', data, cacheDataFilterArgs)
    }

    /* Output */

    return data
  } catch (error) {
    console.error(config.console.red, '[SSF] Error fetching Contentful data: ', error)

    return {}
  }
}

/* Exports */

export default getContentfulData
