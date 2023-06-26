/**
 * Utils - get contentful data
 */

/* Imports */

import { config } from '../../config'
import requireFile from '../../utils/require-file'

/**
 * Function - fetch data from contentful cms
 *
 * @param {string} key
 * @param {object} params
 * @param {boolean} cache
 * @return {object}
 */

interface Params {
  [key: string]: string | number | boolean
}

interface Items {
  items?: any[]
  [key: string]: any
}

const getContentfulData = async (
  key: string = '',
  params: Params = {},
  cache: boolean = false
): Promise<Items> => {
  try {
    /* Resolve module required */

    const resolveResponseModule = requireFile(config.modules.contentfulResolveResponse?.path, config.modules.contentfulResolveResponse?.local)

    if (resolveResponseModule === null || typeof resolveResponseModule !== 'function') {
      throw new Error('No resolve response module')
    }

    /* Key required for cache */

    if (key === '') {
      throw new Error('No key')
    }

    /* Check cache */

    let cacheModule: Function | null = null

    if (cache) {
      cacheModule = requireFile(config.modules.cache?.path, config.modules.cache?.local)

      if (cacheModule !== null && typeof cacheModule === 'function') {
        const data = cacheModule(key)

        if (data !== undefined) {
          return data
        }
      }
    }

    /* Credentials */

    const credentials: Formation.Cms = config.cms

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
    const data = await resp.json()

    if (data?.items !== undefined) {
      data.items = resolveResponseModule(data)
    } else {
      throw new Error('No items')
    }

    /* Store in cache */

    if (cacheModule !== null && typeof cacheModule === 'function') {
      await cacheModule(data)
    }

    /* Output */

    return data
  } catch (error) {
    console.error('Error fetching Contentful data: ', error)

    return {}
  }
}

/* Exports */

export default getContentfulData
