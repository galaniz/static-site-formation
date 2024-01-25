/**
 * Utils - Process Images Types
 */

/**
 * @typedef {object} ProcessImagesSharp
 * @prop {number} size
 * @prop {string} ext
 * @prop {string} path
 * @prop {string} newPath
 */
export interface ProcessImagesSharp {
  size: number
  ext: string
  path: string
  newPath: string
}

/**
 * @typedef {object} ProcessImagesProps
 * @prop {string} base
 * @prop {number} width
 * @prop {number} height
 * @prop {string} format
 */
export interface ProcessImagesProps {
  base: string
  width: number
  height: number
  format: string
}

/**
 * @typedef {Object.<string, ProcessImagesProps>} ProcessImagesStore
 */
export interface ProcessImagesStore {
  [key: string]: ProcessImagesProps
}
