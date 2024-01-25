/**
 * Utils - Get Link
 */

/* Imports */

import type { Generic, InternalLink } from '../../global/globalTypes'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'
import { getProp } from '../getProp/getProp'
import { isObjectStrict } from '../isObject/isObject'
import { isString, isStringStrict } from '../isString/isString'

/**
 * Function - get permalink from external or internal source
 *
 * @param {InternalLink|Generic} [internalLink]
 * @param {string} [externalLink]
 * @return {string}
 */
const getLink = (internalLink?: InternalLink | Generic, externalLink?: string): string => {
  if (isObjectStrict(internalLink)) {
    const id = getProp(internalLink, 'id')
    const contentType = getProp(internalLink, 'contentType')
    const linkContentType = getProp(internalLink, 'linkContentType')
    const slug = getProp(internalLink, 'slug')

    const res = getSlug({
      id: isStringStrict(id) ? id : '',
      contentType: isStringStrict(contentType) ? contentType : '',
      linkContentType: isStringStrict(linkContentType) ? linkContentType : undefined,
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
