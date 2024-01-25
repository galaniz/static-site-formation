/**
 * Utils - Is String Array
 */

import { isStringStrict } from '../isString/isString'
import { isArrayStrict } from '../isArray/isArray'

/**
 * Function - check if value is an array of strings
 *
 * @param {*} value
 * @param {number} [depth=1]
 * @return {boolean}
 */
const isStringArray = (value: unknown, depth: number = 1): value is string[] => {
  if (!isArrayStrict(value)) {
    return false
  }

  let containsStr = false

  for (let i = 0; i < value.length; i += 1) {
    if (i === depth) {
      break
    }

    containsStr = isStringStrict(value[i])

    if (!containsStr) {
      break
    }
  }

  return containsStr
}

/* Exports */

export { isStringArray }
