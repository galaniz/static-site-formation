/**
 * Utils - Undefine Props
 */

/* Imports */

import type { Generic } from '../../global/globalTypes'
import { isObject } from '../isObject/isObject'
import { isArray } from '../isArray/isArray'

/**
 * Function - set property in object or array of objects to undefined
 *
 * @param {Generic|Generic[]} obj
 * @param {string[]} props
 * @return {Generic|Generic[]}
 */
const undefineProps = (obj: Generic | Generic[], props: string[] = []): Generic | Generic[] => {
  if (!isObject(obj)) {
    return obj
  }

  const isArr = isArray(obj)
  let objArr = isArr ? obj : [obj]

  objArr = structuredClone(objArr)

  objArr.forEach((o) => {
    if (!isObject(o)) {
      return
    }

    Object.keys(o).forEach((k) => {
      if (props.includes(k) && o[k] !== undefined) {
        o[k] = undefined
      }
    })
  })

  if (!isArr) {
    return objArr[0]
  }

  return objArr
}

/* Exports */

export { undefineProps }
