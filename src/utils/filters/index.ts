/**
 * Utils - filters
 */

/**
 * Store filter callbacks by name
 *
 * @type {object}
 */

const filters: object = {}

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
 * @param {array<*>} args
 * @return {*}
 */

const applyFilters = (name: string, value: any, ...args: any[]): any => {
  const callbacks = filters[name]

  if (Array.isArray(callbacks)) {
    callbacks.forEach((callback) => {
      if (typeof callback === 'function') {
        value = callback(value, ...args)
      }
    })
  }

  return value
}

/* Exports */

export { addFilter, removeFilter, applyFilters }
