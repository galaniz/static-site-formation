/**
 * Utils - get image
 */

/* Imports */

import config from '../../config'

/**
 * Function - consistent data object regardless of source
 *
 * @private
 * @param {object} data
 * @return {object|undefined}
 */

interface _ImageNormalData {
  url: string
  alt: string
  naturalWidth: number
  naturalHeight: number
}

const _normalizeImageData = (data: FRM.ImageData): _ImageNormalData | undefined => {
  if (config.source === 'static') {
    const {
      base = '',
      alt = '',
      width = 0,
      height = 0
    } = data

    if (base === '' || width === 0 || height === 0) {
      return
    }

    const url = `${config.image.url}${base}`

    return {
      url,
      alt,
      naturalWidth: width,
      naturalHeight: height
    }
  } else {
    const { file, description = '' } = data

    /* File required */

    if (file === undefined) {
      return
    }

    const { url = '', details } = file

    /* Url and details required */

    if (url === '' || details === undefined) {
      return
    }

    return {
      url,
      alt: description,
      naturalWidth: details.image.width,
      naturalHeight: details.image.height
    }
  }
}

/**
 * Function - get responsive image output
 *
 * @param {object} args
 * @param {object} args.data
 * @param {string} args.classes
 * @param {string} args.attr
 * @param {string|number} args.width
 * @param {string|number} args.height
 * @param {boolean} args.returnAspectRatio
 * @param {boolean} args.lazy
 * @param {number} args.max
 * @return {string|object}
 */

const getImage = (args: FRM.ImageArgs = {}): string | { output: string, aspectRatio: number } => {
  const {
    data,
    classes = '',
    attr = '',
    width = 'auto',
    height = 'auto',
    returnAspectRatio = false,
    lazy = true,
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
    naturalHeight
  } = normalData

  /* Dimensions */

  const aspectRatio = naturalHeight / naturalWidth
  const aspectRatioReverse = naturalWidth / naturalHeight

  let w = naturalWidth
  let h = naturalHeight

  if (typeof width === 'number') {
    w = width
    h = typeof height === 'string' ? w * aspectRatio : height
  }

  if (typeof height === 'number') {
    h = height
    w = typeof width === 'string' ? h * aspectRatioReverse : width
  }

  if (w > maxWidth) {
    w = Math.round(maxWidth)
    h = Math.round(w * aspectRatio)
  }

  /* Src and sizes attributes */

  let src = url

  if (config.source === 'static') {
    src = `${url}.webp`
  } else {
    src = `https:${url}?fm=webp&q=${quality}&w=${w}&h=${h}`
  }

  const sizes = `(min-width: ${w / 16}rem) ${w / 16}rem, ${viewportWidth}vw`

  let srcset: string[] | number[] = config.image.sizes

  if (!srcset.includes(w)) {
    srcset.push(w)
  }

  srcset = srcset.filter(s => s <= w)

  srcset.sort((a, b) => a - b)

  srcset = srcset.map(s => {
    if (config.source === 'static') {
      return `${url}${s !== naturalWidth ? `@${s}` : ''}.webp ${s}w`
    } else {
      return `https:${url}?fm=webp&q=${quality}&w=${s}&h=${Math.round(s * aspectRatio)} ${s}w`
    }
  })

  /* Output */

  const output = `
    <img${classes !== '' ? ` class="${classes}"` : ''} alt="${alt}" src="${src}" srcset="${srcset.join(', ')}" sizes="${sizes}" width="${w}" height="${h}"${attr !== '' ? ` ${attr}` : ''}${lazy ? ' loading="lazy" decoding="async"' : ' loading="eager"'}>
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

export default getImage
