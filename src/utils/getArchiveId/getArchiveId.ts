/**
 * Utils - Get Archive Id
 */

/* Imports */

import { config } from '../../config/config'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'

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
    const archiveId = config.contentTypes.archive[contentType].id

    if (isObjectStrict(archiveId)) {
      const contentTypeArchiveId = archiveId[linkContentType]

      id = isStringStrict(contentTypeArchiveId) ? contentTypeArchiveId : ''
    }
  }

  return id
}

/* Exports */

export { getArchiveId }
