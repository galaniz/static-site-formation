/**
 * Utils - Get Json
 */

/* Imports */

import { isObject } from '../isObject/isObject'

/**
 * Function - check and return valid JSON or fallback
 *
 * @param {string} value
 * @return {object|undefined}
 */
const getJson = <T>(value: string): object & T | undefined => {
  try {
    const obj = JSON.parse(value)

    if (isObject(obj)) {
      return obj
    }
  } catch {
    return undefined
  }

  return undefined
}

/**
 * Function - import json file and return contents if object
 *
 * @param {string} path
 * @return {Promise<object|undefined>}
 */
const getJsonFile = async <T>(path: string): Promise<object & T | undefined> => {
  try {
    const { default: obj } = await import(path) // Removed assert json as not all exports are esnext

    if (isObject(obj)) {
      return obj
    }
  } catch {
    return undefined
  }

  return undefined
}

/* Exports */

export { getJson, getJsonFile }
