/**
 * Utils - Get Archive Link
 */

/* Imports */

import { config } from '../../config/config'
import { getArchiveId } from '../getArchiveId/getArchiveId'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'

/**
 * Function - get archive link by content type
 *
 * @param {string} contentType
 * @return {object}
 */

interface ArchiveLinkReturn {
  title: string
  link: string
}

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

      if (typeof s === 'string') {
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
