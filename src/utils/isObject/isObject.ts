/**
 * Utils - Is Object
 */

/**
 * Function - check if value is an object
 *
 * @param {*} value
 * @return {boolean}
 */
const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null && value !== undefined
}

/**
 * Function - check if value is an object and not array
 *
 * @param {*} value
 * @return {boolean}
 */
const isObjectStrict = (value: unknown): value is object => {
  if (Array.isArray(value)) {
    return false
  }

  return typeof value === 'object' && value !== null && value !== undefined
}

/* Exports */

export { isObject, isObjectStrict }
