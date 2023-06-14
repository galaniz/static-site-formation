/**
 * Utils - get normal param
 */

/* Imports */

import { config } from '../../config'

/**
 * Function - normalize param value if specified in config
 *
 * @param {string} param
 * @param {string} value
 * @return {string}
 */

const getNormalParam = (param: string, value: string): string => {
  if (config.normalizedParams?.[param] !== undefined) {
    return config.normalizedParams[param]
  }

  return value
}

/* Exports */

export default getNormalParam
