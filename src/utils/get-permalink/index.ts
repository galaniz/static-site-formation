/**
 * Utils - get permalink
 */

/* Imports */

import config from '../../config'

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

export default getPermalink
