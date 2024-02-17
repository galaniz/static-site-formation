/**
 * Utils - Get Link
 */

/* Imports */

import type { InternalLink } from '../../global/globalTypes'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'
import { getProp } from '../getProp/getProp'
import { isObjectStrict } from '../isObject/isObject'
import { isString, isStringStrict } from '../isString/isString'

/**
 * Function - get permalink from external or internal source
 *
 * @param {import('../../global/globalTypes').InternalLink} [internalLink]
 * @param {string} [externalLink]
 * @return {string}
 */
const getLink = (internalLink?: InternalLink, externalLink?: string): string => {
  if (isObjectStrict(internalLink)) {
    const slug = getProp.fields(internalLink, 'slug')

    const res = getSlug({
      id: getProp.id(internalLink),
      contentType: getProp.type(internalLink, 'content'),
      linkContentType: getProp.fields(internalLink, 'linkContentType'),
      slug: isString(slug) ? slug : ''
    })

    if (isString(res)) {
      return getPermalink(res)
    }

    return ''
  }

  return isStringStrict(externalLink) ? externalLink : ''
}

/* Exports */

export { getLink }
