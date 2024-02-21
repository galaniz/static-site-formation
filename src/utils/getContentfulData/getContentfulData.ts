/**
 * Utils - Get Contentful Data
 */

/* Imports */

import type { ContentfulDataParams, ContentfulDataReturn } from './getContentfulDataTypes'
import resolveResponse from 'contentful-resolve-response'
import { applyFilters, isObject, isObjectStrict, isStringStrict } from '../utilsMin'
import { config } from '../../config/config'

/**
 * Function - fetch data from contentful cms or cache
 *
 * @param {string} key
 * @param {import('./getContentfulDataTypes').ContentfulDataParams} params
 * @return {Promise<import('./getContentfulDataTypes').ContentfulDataReturn>}
 */
const getContentfulData = async (
  key: string = '',
  params: ContentfulDataParams = {}
): Promise<ContentfulDataReturn> => {
  try {
    /* Key required for cache */

    if (!isStringStrict(key)) {
      throw new Error('No key')
    }

    /* Check cache */

    if (config.env.cache) {
      let cacheData: ContentfulDataReturn = {}

      const cacheDataFilterArgs = {
        key,
        type: 'get'
      }

      cacheData = await applyFilters('cacheData', cacheData, cacheDataFilterArgs)

      if (isObject(cacheData) && Object.keys(cacheData).length > 0) {
        return structuredClone(cacheData)
      }
    }

    /* Credentials */

    const {
      space,
      previewAccessToken,
      deliveryAccessToken,
      previewHost,
      deliveryHost
    } = config.cms

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
    const data: ContentfulDataReturn = await resp.json()

    if (!isObjectStrict(data)) {
      throw new Error('No data')
    }

    if (data.items === undefined) {
      throw new Error('No items')
    }

    data.items = resolveResponse(data)

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
