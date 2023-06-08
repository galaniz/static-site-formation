/**
 * Utils - get year
 */

/**
 * Function - get current year as YYYY
 *
 * @return {number}
 */

const getYear = (): number => {
  const date = new Date()

  return date.getFullYear()
}

/* Exports */

export default getYear
