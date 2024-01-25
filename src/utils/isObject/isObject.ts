/**
 * Utils - Is Object
 */

import type { Generic } from '../../global/globalTypes'

/**
 * Function - check if value is an object
 *
 * @param {*} value
 * @return {boolean}
 */
const isObject = (value: unknown): value is unknown[] | Generic => {
  return typeof value === 'object' && value !== null && value !== undefined
}

/**
 * Function - check if value is an object and not array
 *
 * @param {*} value
 * @return {boolean}
 */
const isObjectStrict = (value: unknown): value is Generic => {
  if (Array.isArray(value)) {
    return false
  }

  return typeof value === 'object' && value !== null && value !== undefined
}

/* Exports */

export { isObject, isObjectStrict }
