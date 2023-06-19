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
  if (config.normalParams?.[param] !== undefined) {
    return config.normalParams[param]
  }

  return value
}

/* Exports */

export default getNormalParam
