/**
 * Utils - is string
 */

/**
 * Function - check is string and not empty
 *
 * @param {string} string
 * @return {boolean}
 */

const isString = (string: string = ''): boolean => {
  return string !== '' && typeof string === 'string'
}

/* Exports */

export default isString
