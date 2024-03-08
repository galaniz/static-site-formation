/**
 * Utils - Remote Images Types
 */

/**
 * @typedef {object} images
 * @prop {string} path
 * @prop {string} url
 * @prop {string} [ext]
 */
export interface Images {
  path: string
  url: string
  ext?: string
}
