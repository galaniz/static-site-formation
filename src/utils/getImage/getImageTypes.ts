/**
 * Utils - Get Image Types
 */

/* Imports */

import type { RenderFile } from '../../render/renderTypes'

/**
 * @typedef {object} ImageArgs
 * @prop {import('../../render/renderTypes').RenderFile} [data]
 * @prop {string} [classes]
 * @prop {string} [attr]
 * @prop {string|number} [width]
 * @prop {string|number} [height]
 * @prop {boolean} [returnDetails]
 * @prop {boolean} [lazy]
 * @prop {boolean} [picture]
 * @prop {number} [quality]
 * @prop {string} [source]
 * @prop {number} [maxWidth]
 * @prop {number} [viewportWidth]
 */
export interface ImageArgs {
  data?: RenderFile
  classes?: string
  attr?: string
  width?: string | number
  height?: string | number
  returnDetails?: boolean
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
 * @prop {string} src
 * @prop {string} srcFallback
 * @prop {string[]} srcset
 * @prop {string} sizes
 * @prop {number} aspectRatio
 * @prop {number} naturalWidth
 * @prop {number} naturalHeight
 */
export interface ImageReturn {
  output: string
  src: string
  srcFallback: string
  srcset: string[]
  sizes: string
  aspectRatio: number
  naturalWidth: number
  naturalHeight: number
}
