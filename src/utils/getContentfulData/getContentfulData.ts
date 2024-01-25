/**
 * Utils - Get Contentful Data
 */

/* Imports */

import type { ContentfulDataParams, ContentfulDataItems } from './getContentfulDataTypes'
import type { Generic } from '../../global/globalTypes'
import resolveResponse from 'contentful-resolve-response'
import { applyFilters, isObject, isStringStrict } from '../../utils'
import { config } from '../../config/config'

/**
 * Function - fetch data from contentful cms or cache
 *
 * @param {string} key
 * @param {ContentfulDataItems} params
 * @return {Promise<ContentfulDataItems>}
 */
const getContentfulData = async (
  key: string = '',
  params: ContentfulDataParams = {}
): Promise<ContentfulDataItems> => {
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

    /* Credentials */

    const credentials = config.cms

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

    if (!isStringStrict(space) || !isStringStrict(accessToken) || !isStringStrict(host)) {
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

    if (data.items !== undefined) {
      data.items = resolveResponse(data)
    } else {
      throw new Error('No items')
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
    console.error(config.console.red, '[SSF] Error fetching Contentful data: ', error)

    return {}
  }
}

/* Exports */

export { getContentfulData }
