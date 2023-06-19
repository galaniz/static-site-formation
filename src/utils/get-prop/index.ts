/**
 * Utils - get prop
 */

/* Imports */

import { config } from '../../config'
import getNormalParam from '../get-normal-param'

/**
 * Function - get prop from object with cms normalization
 *
 * @param {object} object
 * @param {string} prop
 * @return {*}
 */

const getProp = (object: { [key: string]: any }, prop: string = ''): any => {
  if (config.cms.name === 'contentful') {
    if (prop === 'id') {
      return object.sys.id
    }

    if (prop === 'renderType') {
      const type = object?.sys?.contentType?.sys?.id

      return type !== undefined ? getNormalParam('contentType', type) : ''
    }

    if (prop === '') {
      return object.fields
    }

    return object.fields[prop]
  }

  if (prop !== '') {
    return object[prop]
  }

  return object
}

/* Exports */

export default getProp
