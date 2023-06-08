/**
 * Utils - get link
 */

/* Imports */

import getPermalink from '../get-permalink'
import getSlug from '../get-slug'

/**
 * Function - get permalink from external or internal source
 *
 * @param {object} internalLink
 * @param {string} externalLink
 * @return {string}
 */

const getLink = (internalLink: Formation.InternalLink | undefined, externalLink: string = ''): string => {
  if (internalLink !== undefined) {
    const slug = getSlug(internalLink)

    if (typeof slug === 'string') {
      return getPermalink(slug)
    }

    return ''
  }

  return externalLink
}

/* Exports */

export default getLink
