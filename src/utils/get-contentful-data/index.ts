/**
 * Utils - get contentful data
 */

/* Imports */

import { config } from '../../config'

/**
 * Function - fetch data from contentful cms
 *
 * @param {string} key
 * @param {object} params
 * @param {function} resolveResponse - external module
 * @param {function} cache - external module
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
  resolveResponse: Function,
  cache: Function
): Promise<Items> => {
  try {
    /* Resolve module required */

    if (resolveResponse === undefined || typeof resolveResponse !== 'function') {
      throw new Error('No resolve response module')
    }

    /* Key required for cache */

    if (key === '') {
      throw new Error('No key')
    }

    /* Check cache */

    if (typeof cache === 'function') {
      const data = cache(key)

      if (data !== undefined) {
        return data
      }
    }

    /* Credentials */

    const credentials: Formation.Cms = config.cms

    const {
      space,
      previewAcessToken,
      deliveryAcessToken,
      previewHost,
      deliveryHost
    } = credentials

    let accessToken = previewAcessToken
    let host = previewHost

    if (config.env.prod) {
      accessToken = deliveryAcessToken
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
      data.items = resolveResponse(data)
    } else {
      throw new Error('No items')
    }

    /* Store in cache */

    if (typeof cache === 'function') {
      await cache(data)
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
