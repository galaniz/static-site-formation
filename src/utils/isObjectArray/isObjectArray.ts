/**
 * Utils - Is Object Array
 */

import type { Generic } from '../../global/globalTypes'
import { isObjectStrict } from '../isObject/isObject'
import { isArrayStrict } from '../isArray/isArray'

/**
 * Function - check if value is an array of objects
 *
 * @param {*} value
 * @param {number} [depth=1]
 * @return {boolean}
 */
const isObjectArray = (value: unknown, depth: number = 1): value is Generic[] => {
  if (!isArrayStrict(value)) {
    return false
  }

  let containsObj = false

  for (let i = 0; i < value.length; i += 1) {
    if (i === depth) {
      break
    }

    containsObj = isObjectStrict(value[i])

    if (!containsObj) {
      break
    }
  }

  return containsObj
}

/* Exports */

export { isObjectArray }
