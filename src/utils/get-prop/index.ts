/**
 * Utils - get prop
 */

/* Imports */

import config from '../../config'

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

    if (prop === 'renderType' || prop === 'contentType') {
      let type: string = object?.sys?.contentType?.sys?.id

      if (type === undefined) {
        type = object?.sys?.type
      }

      if (prop === 'renderType' && config.renderTypes?.[type] !== undefined) {
        type = config.renderTypes[type]
      }

      return typeof type === 'string' ? type : ''
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
