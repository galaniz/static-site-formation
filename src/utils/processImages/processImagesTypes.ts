/**
 * Utils - Process Images Types
 */

/**
 * @typedef {object} ImagesSharp
 * @prop {number} size
 * @prop {string} ext
 * @prop {string} path
 * @prop {string} newPath
 */
export interface ImagesSharp {
  size: number
  ext: string
  path: string
  newPath: string
}

/**
 * @typedef {object} ImagesProps
 * @prop {string} path
 * @prop {string} name
 * @prop {string} type
 * @prop {string} format
 * @prop {number} width
 * @prop {number} height
 * @prop {number} size
 */
export interface ImagesProps {
  path: string
  name: string
  type: string
  format: string
  width: number
  height: number
  size: number
}

/**
 * @typedef {Object.<string, ImagesProps>} ImagesStore
 */
export interface ImagesStore {
  [key: string]: ImagesProps
}
