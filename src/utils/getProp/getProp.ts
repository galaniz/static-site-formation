/**
 * Utils - Get Prop
 */

/* Imports */

import type { Generic } from '../../global/types/types'
import { config } from '../../config/config'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'

/**
 * @typedef Prop
 * @type {Generic}
 * @prop {object} [sys]
 * @prop {string} [sys.id]
 * @prop {string} [sys.type]
 * @prop {object} [sys.contentType]
 * @prop {object} [sys.contentType.sys]
 * @prop {string} [sys.contentType.sys.id]
 * @prop {Object.<string, *>} [fields]
 */
interface Prop extends Generic {
  sys?: {
    id?: string
    type?: string
    contentType?: {
      sys?: {
        id?: string
      }
    }
  }
  fields?: Generic
}

/**
 * Function - get prop from object with cms normalization
 *
 * @param {Object.<string, *>} object
 * @param {string} prop
 * @param {*} [fallback]
 * @return {*|string|undefined}
 */
const getProp = <T extends Prop>(
  object: T,
  prop: string = '',
  fallback?: unknown
): T | string | undefined | unknown => {
  /* Check if object */

  if (!isObjectStrict(object)) {
    return fallback
  }

  /* Contentful */

  if (config.cms.name === 'contentful') {
    const sys = isObjectStrict(object.sys) ? object.sys : {}

    /* Id */

    if (prop === 'id') {
      return isStringStrict(sys.id) ? sys.id : ''
    }

    /* Type */

    if (prop === 'renderType' || prop === 'contentType') {
      let type = ''

      if (isStringStrict(sys?.contentType?.sys?.id)) {
        type = sys?.contentType?.sys?.id
      }

      if (isStringStrict(sys.type) && type === '') {
        type = sys.type
      }

      if (prop === 'renderType' && config.renderTypes?.[type] !== undefined) {
        type = config.renderTypes[type]
      }

      return type
    }

    /* Fields */

    if (isStringStrict(prop)) {
      return object.fields !== undefined ? object.fields : fallback
    }

    /* Fallback */

    return fallback
  }

  /* Static */

  if (isStringStrict(prop)) {
    return object[prop] !== undefined ? object[prop] : fallback
  }

  /* Fallback */

  return fallback
}

/* Exports */

export { getProp }
