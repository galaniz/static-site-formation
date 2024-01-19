/**
 * Utils - Get Link
 */

/* Imports */

import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'
import { getProp } from '../getProp/getProp'

/**
 * Function - get permalink from external or internal source
 *
 * @param {object} internalLink
 * @param {string} externalLink
 * @return {string}
 */

const getLink = (internalLink: FRM.InternalLink | undefined, externalLink: string = ''): string => {
  if (internalLink !== undefined) {
    const slugArgs = {
      id: getProp(internalLink, 'id'),
      contentType: getProp(internalLink, 'contentType'),
      linkContentType: getProp(internalLink, 'linkContentType'),
      slug: getProp(internalLink, 'slug')
    }

    const slug = getSlug(slugArgs)

    if (typeof slug === 'string') {
      return getPermalink(slug)
    }

    return ''
  }

  return externalLink
}

/* Exports */

export { getLink }
