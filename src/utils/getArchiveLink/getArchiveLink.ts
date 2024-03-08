/**
 * Utils - Get Archive Link
 */

/* Imports */

import type { ArchiveLinkReturn } from './getArchiveLinkTypes'
import { config } from '../../config/config'
import { isStringStrict } from '../isString/isString'
import { getArchiveId } from '../getArchiveId/getArchiveId'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'

/**
 * Function - get archive link by content type
 *
 * @param {string} contentType
 * @param {string} [linkContentType]
 * @return {import('./getArchiveLinkTypes').ArchiveLinkReturn}
 */
const getArchiveLink = (contentType: string = '', linkContentType?: string): ArchiveLinkReturn => {
  let archiveLink = ''
  let archiveTitle = ''

  const archiveId = getArchiveId(contentType, linkContentType)
  const archiveInfo = config.slug.archives[archiveId]

  archiveTitle = config.contentTypes.archive[contentType].plural

  if (archiveInfo !== undefined) {
    const archiveSlug = archiveInfo.slug

    if (isStringStrict(archiveId) && isStringStrict(archiveSlug)) {
      const s = getSlug({
        id: archiveId,
        slug: archiveSlug,
        contentType: 'page'
      })

      if (isStringStrict(s)) {
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
