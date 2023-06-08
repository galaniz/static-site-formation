/**
 * Utils - get archive link
 */

/* Imports */

import { config } from '../../config'
import getPermalink from '../get-permalink'
import getSlug from '../get-slug'

/**
 * Function - get archive link by content type
 *
 * @param {string} contentType
 * @return {object}
 */

interface Return {
  title: string
  link: string
}

const getArchiveLink = (contentType: string = ''): Return => {
  let archiveLink = ''
  let archiveTitle = ''

  if (config.slug.bases[contentType] !== undefined) {
    archiveTitle = config.slug.bases[contentType].title

    const archiveId: string | undefined = config.slug.bases[contentType].archiveId
    const archiveSlug: string = config.slug.bases[contentType].slug

    if (archiveId !== '' && archiveId !== undefined && archiveSlug !== '') {
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

export default getArchiveLink
