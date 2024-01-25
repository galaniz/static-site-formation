/**
 * Utils - Filters
 */

/* Imports */

import { isArrayStrict } from '../isArray/isArray'
import { isStringStrict } from '../isString/isString'
import { isObjectStrict } from '../isObject/isObject'

/**
 * Store filter callbacks by name
 *
 * @type {Object.<string, function>}
 */
let filters: { [key: string]: Function[] } = {}

/**
 * Function - add filter to filters object
 *
 * @param {string} name
 * @param {function} filter
 * @return {boolean}
 */
const addFilter = (name: string, filter: Function): boolean => {
  if (!isStringStrict(name) || typeof filter !== 'function') {
    return false
  }

  if (filters[name] === undefined) {
    filters[name] = []
  }

  filters[name].push(filter)

  return true
}

/**
 * Function - remove filter from filters object
 *
 * @param {string} name
 * @param {function} filter
 * @return {boolean}
 */
const removeFilter = (name: string, filter: Function): boolean => {
  if (!isStringStrict(name) || typeof filter !== 'function') {
    return false
  }

  const callbacks = filters[name]

  if (isArrayStrict(callbacks)) {
    const index = callbacks.indexOf(filter)

    if (index > -1) {
      filters[name].splice(index, 1)

      return true
    }
  }

  return false
}

/**
 * Function - update value from callback return values
 *
 * @param {string} name
 * @param {*} value
 * @param {*} [args]
 * @return {Promise<*>}
 */
const applyFilters = async <T, U>(name: string, value: T, args?: U): Promise<T> => {
  const callbacks = filters[name]

  if (isArrayStrict(callbacks)) {
    for (let i = 0; i < callbacks.length; i += 1) {
      const callback = callbacks[i]

      if (typeof callback === 'function') {
        value = await callback(value, args)
      }
    }
  }

  return value
}

/**
 * Function - empty filters object
 *
 * @return {void}
 */
const resetFilters = (): void => {
  filters = {}
}

/**
 * Function - fill filters object
 *
 * @param {Object.<string, Function>} args
 * @return {boolean}
 */
const setFilters = (args: { [key: string]: Function }): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  if (Object.keys(args).length === 0) {
    return false
  }

  resetFilters()

  Object.keys(args).forEach((a) => {
    addFilter(a, args[a])
  })

  return true
}

/* Exports */

export {
  addFilter,
  removeFilter,
  applyFilters,
  resetFilters,
  setFilters
}
