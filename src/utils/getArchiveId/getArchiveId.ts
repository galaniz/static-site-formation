/**
 * Utils - Get Archive Id
 */

/* Imports */

import { config } from '../../config/config'
import { isObject } from '../isObject/isObject'
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

    if (isObject(archiveId)) {
      id = isStringStrict(archiveId[linkContentType]) ? archiveId[linkContentType] as string : ''
    }
  }

  return id
}

/* Exports */

export { getArchiveId }
