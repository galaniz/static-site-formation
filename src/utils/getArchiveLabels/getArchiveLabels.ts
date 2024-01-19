/**
 * Utils - Get Archive Labels
 */

/* Imports */

import { config } from '../../config/config'

/**
 * Function - singular and plural labels by content type
 *
 * @private
 * @param {string} contentType
 * @param {string|string[]} linkContentType
 * @param {boolean} isTerm
 * @return {object}
 */

const getArchiveLabels = (
  contentType: string = '',
  linkContentType: string | string[],
  isTerm: boolean = false
): { singular: string, plural: string } => {
  let singular = 'post'
  let plural = 'posts'
  let type = contentType

  if (isTerm) {
    linkContentType = Array.isArray(linkContentType) ? linkContentType : [linkContentType]
    type = linkContentType.length > 0 ? linkContentType[0] : ''
  }

  if (type !== '') {
    singular = config.contentTypes.archive[type].singular.toLowerCase()
    plural = config.contentTypes.archive[type].plural.toLowerCase()
  }

  return {
    singular,
    plural
  }
}

/* Exports */

export { getArchiveLabels }
