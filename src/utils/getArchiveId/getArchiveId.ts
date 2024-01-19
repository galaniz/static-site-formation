/**
 * Utils - Get Archive Id
 */

/* Imports */

import { config } from '../../config/config'

/**
 * Function - get archive id from config slug
 *
 * @param {string} contentType
 * @param {string} linkContentType
 * @return {string}
 */

const getArchiveId = (contentType: string = '', linkContentType: string = 'default'): string => {
  let id = ''

  if (config.contentTypes.archive[contentType] !== undefined) {
    const archiveId: string | FRM.AnyObject | undefined = config.contentTypes.archive[contentType].id

    if (typeof archiveId === 'object' && archiveId !== undefined) {
      id = archiveId[linkContentType]
    }
  }

  return id
}

/* Exports */

export { getArchiveId }
