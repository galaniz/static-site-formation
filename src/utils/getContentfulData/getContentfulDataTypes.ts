/**
 * Utils - Get Contentful Data Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes'
import { RenderItem } from '../../render/RenderTypes'

/**
 * @typedef {Object.<string, (string|number|boolean)>} ContentfulDataParams
 */
export interface ContentfulDataParams {
  [key: string]: string | number | boolean
}

/**
 * @typedef ContentfulDataReturn
 * @type {Generic}
 * @prop {*[]} [items]
 * @prop {*[]} [errors]
 */
export interface ContentfulDataReturn extends Generic {
  items?: RenderItem[]
  errors?: Generic[]
}
