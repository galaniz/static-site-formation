/**
 * Utils - Get Contentful Data Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes'
import type { RenderItem } from '../../render/RenderTypes'

/**
 * @typedef {Object.<string, (string|number|boolean)>} ContentfulDataParams
 */
export interface ContentfulDataParams {
  [key: string]: string | number | boolean
}

/**
 * @typedef ContentfulDataReturn
 * @type {import('../../global/globalTypes').Generic}
 * @prop {import('../../render/RenderTypes').RenderItem[]} [items]
 * @prop {*[]} [errors]
 */
export interface ContentfulDataReturn extends Generic {
  items?: RenderItem[]
  errors?: Generic[]
}
