/**
 * Utils - get archive id
 */

/* Imports */

import config from '../../config'

/**
 * Function - get archive id from config slug
 *
 * @param {string} contentType
 * @param {string} linkContentType
 * @return {string}
 */

const getArchiveId = (contentType: string = '', linkContentType: string = 'default'): string => {
  let id = ''

  if (config.slug.bases[contentType] !== undefined) {
    const archiveId: string | object | undefined = config.slug.bases[contentType].archiveId

    if (typeof archiveId === 'object' && archiveId !== undefined) {
      id = archiveId[linkContentType]
    }
  }

  return id
}

/* Exports */

export default getArchiveId
