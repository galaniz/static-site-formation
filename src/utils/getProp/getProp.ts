/**
 * Utils - Get Prop
 */

/* Imports */

import { config } from '../../config/config'

/**
 * Function - get prop from object with cms normalization
 *
 * @param {object} object
 * @param {string} prop
 * @param {*} undefinedFallback
 * @return {*}
 */

const getProp = (object: { [key: string]: any } = {}, prop: string = '', undefinedFallback?: any): any => {
  if (config.cms.name === 'contentful') {
    if (prop === 'id') {
      return object?.sys?.id !== undefined ? object.sys.id : ''
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
      return object.fields !== undefined ? object.fields : undefinedFallback
    }

    return object?.fields?.[prop] !== undefined ? object.fields[prop] : undefinedFallback
  }

  if (prop !== '') {
    return object[prop] !== undefined ? object[prop] : undefinedFallback
  }

  return object
}

/* Exports */

export { getProp }
