/**
 * Utils - Get Link
 */

/* Imports */

import type { InternalLink } from '../../global/types/types'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'
import { getProp } from '../getProp/getProp'
import { isObject } from '../isObject/isObject'
import { isString, isStringStrict } from '../isString/isString'

/**
 * Function - get permalink from external or internal source
 *
 * @param {InternalLink} [internalLink]
 * @param {string} [externalLink]
 * @return {string}
 */

const getLink = (internalLink?: InternalLink, externalLink?: string): string => {
  if (isObject(internalLink)) {
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
