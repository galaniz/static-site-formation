/**
 * Utils - Get File Data Types
 */

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

export interface FileDataReturn {
  [key: string]: RenderItem
}
