/**
 * Utils - Is Number
 */

/**
 * Function - check if value is number
 *
 * @param {*} value
 * @return {boolean}
 */
const isNumber = (value: unknown): value is number => {
  return typeof value === 'number'
}

/* Exports */

export { isNumber }
