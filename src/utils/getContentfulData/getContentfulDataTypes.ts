/**
 * Utils - Get Contentful Data Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes'

/**
 * @typedef {Object.<string, (string|number|boolean)>} ContentfulDataParams
 */
export interface ContentfulDataParams {
  [key: string]: string | number | boolean
}

/**
 * @typedef ContentfulDataItems
 * @type {Generic}
 * @prop {*[]} [items]
 * @prop {*[]} [errors]
 */
export interface ContentfulDataItems extends Generic {
  items?: Generic[]
  errors?: Generic[]
}
