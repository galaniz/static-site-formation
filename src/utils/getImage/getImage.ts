/**
 * Utils - Get Image
 */

/* Imports */

import { config } from '../../config/config'
import { isString, isStringStrict } from '../isString/isString'

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
 * @typedef {object} _ImageNormalData
 * @prop {string} url
 * @prop {string} alt
 * @prop {number} naturalWidth
 * @prop {number} naturalHeight
 * @prop {string} format
 */

interface _ImageNormalData {
  url: string
  alt: string
  naturalWidth: number
  naturalHeight: number
  format: string
}

/**
 * Function - consistent data object regardless of source
 *
 * @private
 * @param {ImageData} data
 * @return {_ImageNormalData|undefined}
 */

const _normalizeImageData = (data: ImageData): _ImageNormalData | undefined => {
  if (config.source === 'static') {
    const {
      base = '',
      alt = '',
      width = 0,
      height = 0,
      format = 'jpg'
    } = data

    if (!isStringStrict(base) || width === 0 || height === 0) {
      return
    }

    const url = `${config.image.url}${base}`

    return {
      url,
      alt,
      naturalWidth: width,
      naturalHeight: height,
      format
    }
  } else {
    const { file, description = '' } = data

    /* File required */

    if (file === undefined) {
      return
    }

    const { url = '', contentType = 'image/jpg', details } = file

    /* Url and details required */

    if (!isStringStrict(url) || details === undefined) {
      return
    }

    return {
      url,
      alt: description,
      naturalWidth: details.image.width,
      naturalHeight: details.image.height,
      format: contentType.split('/')[1]
    }
  }
}

/**
 * Function - get responsive image output
 *
 * @param {ImageArgs} args
 * @return {ImageReturn|string}
 */

const getImage = (args: ImageArgs = {}): ImageReturn | string => {
  const {
    data,
    classes = '',
    attr = '',
    width = 'auto',
    height = 'auto',
    returnAspectRatio = false,
    lazy = true,
    source = false,
    quality = config.image.quality,
    maxWidth = 1200,
    viewportWidth = 100
  } = args

  /* Data required */

  if (data === undefined) {
    return ''
  }

  const normalData = _normalizeImageData(data)

  if (normalData === undefined) {
    return ''
  }

  const {
    url = '',
    alt = '',
    naturalWidth,
    naturalHeight,
    format = 'jpg'
  } = normalData

  /* Dimensions */

  const aspectRatio = naturalHeight / naturalWidth
  const aspectRatioReverse = naturalWidth / naturalHeight

  let w = naturalWidth
  let h = naturalHeight

  if (typeof width === 'number') {
    w = width
    h = isString(height) ? w * aspectRatio : height
  }

  if (typeof height === 'number') {
    h = height
    w = isString(width) ? h * aspectRatioReverse : width
  }

  if (w > maxWidth) {
    w = Math.round(maxWidth)
    h = Math.round(w * aspectRatio)
  }

  /* Src and sizes attributes */

  let src = url
  let srcFallback = url

  if (config.source === 'static') {
    src = `${url}.webp`
    srcFallback = `${url}.${format}`
  } else {
    const common = `&q=${quality}&w=${w}&h=${h}`

    src = `https:${url}?fm=webp${common}`
    srcFallback = `https:${url}?fm=${format}${common}`
  }

  const sizes = `(min-width: ${w / 16}rem) ${w / 16}rem, ${viewportWidth}vw`

  let srcset: string[] | number[] = config.image.sizes
  const srcsetFallback: string[] = []

  if (!srcset.includes(w)) {
    srcset.push(w)
  }

  srcset = srcset.filter(s => s <= w)

  srcset.sort((a, b) => a - b)

  srcset = srcset.map(s => {
    if (config.source === 'static') {
      const common = `${url}${s !== naturalWidth ? `@${s}` : ''}`

      srcsetFallback.push(`${common}.${format} ${s}w`)

      return `${common}.webp ${s}w`
    } else {
      const common = `&q=${quality}&w=${s}&h=${Math.round(s * aspectRatio)} ${s}w`

      srcsetFallback.push(`https:${url}?fm=${format}${common}`)

      return `https:${url}?fm=webp${common}`
    }
  })

  /* Output */

  let sourceOutput = ''

  if (source) {
    sourceOutput = `<source srcset="${srcset.join(', ')}" sizes="${sizes}" type="image/webp">`
  }

  let eagerHackOutput = ''

  if (!lazy) {
    eagerHackOutput = `<img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg height='${h}' width='${w}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E'" style="pointerEvents: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%">`
  }

  const output = `
    ${eagerHackOutput}
    ${sourceOutput}
    <img${classes !== '' ? ` class="${classes}"` : ''} alt="${alt}" src="${source ? srcFallback : src}" srcset="${source ? srcsetFallback.join(', ') : srcset.join(', ')}" sizes="${sizes}" width="${w}" height="${h}"${attr !== '' ? ` ${attr}` : ''}${lazy ? ' loading="lazy" decoding="async"' : ' loading="eager"'}>
  `

  if (returnAspectRatio) {
    return {
      output,
      aspectRatio
    }
  }

  return output
}

/* Exports */

export { getImage }
