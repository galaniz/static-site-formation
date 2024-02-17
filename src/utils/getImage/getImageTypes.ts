/**
 * Utils - Get Image Types
 */

/* Imports */

import type { PropFile } from '../getProp/getPropTypes'

/**
 * @typedef {object} ImageArgs
 * @prop {import('../getProp/getPropTypes').PropFile} [data]
 * @prop {string} [classes]
 * @prop {string} [attr]
 * @prop {string|number} [width]
 * @prop {string|number} [height]
 * @prop {boolean} [returnAspectRatio]
 * @prop {boolean} [lazy]
 * @prop {boolean} [picture]
 * @prop {number} [quality]
 * @prop {string} [source]
 * @prop {number} [maxWidth]
 * @prop {number} [viewportWidth]
 */
export interface ImageArgs {
  data?: PropFile
  classes?: string
  attr?: string
  width?: string | number
  height?: string | number
  returnAspectRatio?: boolean
  lazy?: boolean
  picture?: boolean
  quality?: number
  source?: string
  maxWidth?: number
  viewportWidth?: number
}

/**
 * @typedef {object} ImageReturn
 * @prop {string} output
 * @prop {number} aspectRatio
 */
export interface ImageReturn {
  output: string
  aspectRatio: number
}
