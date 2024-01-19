/**
 * Utils - Filters
 */

/**
 * Store filter callbacks by name
 *
 * @type {object}
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
  if (name === undefined || name === '' || filter === undefined) {
    return false
  }

  if (filters?.[name] === undefined) {
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
  if (name === undefined || name === '' || filter === undefined) {
    return false
  }

  const callbacks = filters[name]

  if (Array.isArray(callbacks)) {
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
 * @param {*} args
 * @return {*}
 */

const applyFilters = async (name: string, value: any, ...args: any): Promise<any> => {
  const callbacks = filters[name]

  if (Array.isArray(callbacks)) {
    for (let i = 0; i < callbacks.length; i += 1) {
      const callback = callbacks[i]

      if (typeof callback === 'function') {
        value = await callback(value, ...args)
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
 * @param {object} args
 * @return {boolean}
 */

const setFilters = (args: { [key: string]: Function }): boolean => {
  if (typeof args !== 'object' || args === undefined || args === null) {
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
