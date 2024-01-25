/**
 * Utils - Get Archive Link
 */

/* Imports */

import type { ArchiveLinkReturn } from './getArchiveLinkTypes'
import { config } from '../../config/config'
import { getArchiveId } from '../getArchiveId/getArchiveId'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'
import { isString } from '../isString/isString'

/**
 * Function - get archive link by content type
 *
 * @param {string} contentType
 * @param {string} linkContentType
 * @return {ArchiveLinkReturn}
 */
const getArchiveLink = (contentType: string = '', linkContentType: string = ''): ArchiveLinkReturn => {
  let archiveLink = ''
  let archiveTitle = ''

  if (config.slug.bases[contentType] !== undefined) {
    archiveTitle = config.contentTypes.archive[contentType].plural

    const archiveId = getArchiveId(contentType, linkContentType)
    const archiveSlug = config.slug.bases[contentType].slug

    if (archiveId !== '' && archiveSlug !== '') {
      const s = getSlug({
        id: archiveId,
        slug: archiveSlug,
        contentType: 'page'
      })

      if (isString(s)) {
        archiveLink = getPermalink(s)
      }
    }
  }

  return {
    title: archiveTitle,
    link: archiveLink
  }
}

/* Exports */

export { getArchiveLink }
