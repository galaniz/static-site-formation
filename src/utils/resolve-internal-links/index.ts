/**
 * Utils - resolve internal links
 */

/**
 * Function - recursively set internal props from outer data
 *
 * @param {object} data
 * @param {object} currentData
 * @param {array<string>} props
 * @param {function} filterValue
 * @return {void}
 */

const resolveInternalLinks = (
  data: object = {},
  currentData: object = {},
  props: string[] = ['internalLink'],
  filterValue?: Function
): void => {
  Object.keys(currentData).forEach((prop) => {
    const value = currentData[prop]

    if (props.includes(prop)) {
      let v = Array.isArray(value) ? value.map((v) => data[v]) : data[value]

      if (typeof filterValue === 'function') {
        v = filterValue(prop, v)
      }

      currentData[prop] = v
    } else {
      if (value !== null && typeof value === 'object') {
        resolveInternalLinks(data, value, props, filterValue)
      }
    }
  })
}

/* Exports */

export default resolveInternalLinks
