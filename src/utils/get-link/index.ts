/**
 * Utils - get link
 */

/* Imports */

import getPermalink from '../get-permalink'
import getSlug from '../get-slug'
import getProp from '../get-prop'

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

export default getLink
