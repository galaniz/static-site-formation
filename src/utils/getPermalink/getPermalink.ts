/**
 * Utils - Get Permalink
 */

/* Imports */

import { config } from '../../config/config'

/**
 * Function - get absolute or relative url
 *
 * @param {string} slug
 * @param {boolean} trailingSlash
 * @return {string}
 */
const getPermalink = (slug: string = '', trailingSlash: boolean = true): string => {
  let url = '/'

  if (config.env.prod) {
    url = config.env.urls.prod
  }

  return `${url}${slug}${slug !== '' && trailingSlash ? '/' : ''}`
}

/* Exports */

export { getPermalink }
