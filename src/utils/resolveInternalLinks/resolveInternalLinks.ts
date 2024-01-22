/**
 * Utils - Resolve Internal Links
 */

/* Imports */

import { isArray } from '../isArray/isArray'
import { isString } from '../isString/isString'
import { isObject } from '../isObject/isObject'

/**
 * Function - recursively set internal props from outer data
 *
 * @param {object} data
 * @param {object} currentData
 * @param {string[]} [props]
 * @param {function} [filterValue]
 * @return {void}
 */
const resolveInternalLinks = <T, U>(
  data: T,
  currentData: U,
  props: string[] = ['internalLink'],
  filterValue?: Function
): void => {
  if (!isObject(data) || !isObject(currentData) || !isArray(props)) {
    return
  }

  Object.keys(currentData).forEach((prop) => {
    const value = currentData[prop as keyof U]

    if (props.includes(prop)) {
      let v

      if (isArray(value)) {
        v = value.map((v) => data[v as keyof T])
      }

      if (isString(value)) {
        v = data[value as keyof T]
      }

      if (typeof filterValue === 'function') {
        v = filterValue(prop, v)
      }

      currentData[prop as keyof U] = v
    } else if (isObject(value)) {
      resolveInternalLinks(data, value, props, filterValue)
    }
  })
}

/* Exports */

export { resolveInternalLinks }
