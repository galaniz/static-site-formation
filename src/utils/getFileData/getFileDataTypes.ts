/**
 * Utils - Get File Data Types
 */

/* Imports */

import type { RenderItem } from '../../render/RenderTypes'

/**
 * @typedef {object} FileDataParams
 * @prop {boolean} [all]
 * @prop {string} [id]
 */
export interface FileDataParams {
  all?: boolean
  id?: string
}

/**
 * @typedef {Object.<string, import('../../render/RenderTypes').RenderItem>} FileDataReturn
 */
export interface FileDataReturn {
  [key: string]: RenderItem
}
