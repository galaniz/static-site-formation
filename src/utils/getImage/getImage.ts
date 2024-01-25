/**
 * Utils - Get Image
 */

/* Imports */

import type { ImageArgs, ImageReturn, ImageData, ImageNormalData } from './getImageTypes'
import { config } from '../../config/config'
import { isString, isStringStrict } from '../isString/isString'
import { isNumber } from '../isNumber/isNumber'

/**
 * Function - consistent data object regardless of source
 *
 * @private
 * @param {ImageData} data
 * @return {ImageNormalData|undefined}
 */
const _normalizeImageData = (data: ImageData): ImageNormalData | undefined => {
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

  if (isNumber(width)) {
    w = width
    h = isString(height) ? w * aspectRatio : height
  }

  if (isNumber(height)) {
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
