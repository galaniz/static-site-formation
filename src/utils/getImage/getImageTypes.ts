/**
 * Utils - Get Image Types
 */

/**
 * @typedef {object} ImageData
 * @prop {string} [base]
 * @prop {string} [alt]
 * @prop {number} [width]
 * @prop {number} [height]
 * @prop {string} [format]
 * @prop {string} [description]
 * @prop {object} [file]
 * @prop {string} file.url
 * @prop {string} file.contentType
 * @prop {object} file.details
 * @prop {object} file.details.image
 * @prop {number} file.details.image.width
 * @prop {number} file.details.image.height
 */
export interface ImageData {
  base?: string
  alt?: string
  width?: number
  height?: number
  format?: string
  description?: string
  file?: {
    url: string
    contentType: string
    details: {
      image: {
        width: number
        height: number
      }
    }
  }
}

/**
 * @typedef {object} ImageArgs
 * @prop {ImageData} [data]
 * @prop {string} [classes]
 * @prop {string} [attr]
 * @prop {string|number} [width]
 * @prop {string|number} [height]
 * @prop {boolean} [returnAspectRatio]
 * @prop {boolean} [lazy]
 * @prop {boolean} [source]
 * @prop {number} [quality]
 * @prop {number} [maxWidth]
 * @prop {number} [viewportWidth]
 */
export interface ImageArgs {
  data?: ImageData | undefined
  classes?: string
  attr?: string
  width?: string | number
  height?: string | number
  returnAspectRatio?: boolean
  lazy?: boolean
  source?: boolean
  quality?: number
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

/**
 * @private
 * @typedef {object} ImageNormalData
 * @prop {string} url
 * @prop {string} alt
 * @prop {number} naturalWidth
 * @prop {number} naturalHeight
 * @prop {string} format
 */
export interface ImageNormalData {
  url: string
  alt: string
  naturalWidth: number
  naturalHeight: number
  format: string
}
