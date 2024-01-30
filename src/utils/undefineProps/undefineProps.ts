/**
 * Utils - Undefine Props
 */

/* Imports */

import { isObject } from '../isObject/isObject'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'

/**
 * Function - set property in object or array of objects to undefined
 *
 * @param {object|object[]} obj
 * @param {string[]} props
 * @return {object|object[]}
 */
const undefineProps = <T>(obj: T, props: string[] = []): T => {
  if (!isObject(obj)) {
    return obj
  }

  const clone = structuredClone(obj)

  getObjectKeys(clone).forEach((prop) => {
    const value = clone[prop]

    if (props.includes(prop.toString())) {
      // @ts-expect-error: Type 'undefined' is not assignable to type 'T[keyof T]'
      clone[prop] = undefined
    } else if (isObject(value)) {
      undefineProps(value, props)
    }
  })

  return clone
}

/* Exports */

export { undefineProps }
