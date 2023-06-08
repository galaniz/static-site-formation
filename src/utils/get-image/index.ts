/**
 * Utils - get image
 */

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

interface Data {
  base: string
  alt?: string
  width: number
  height: number
}

interface Args {
  data?: Data
  classes?: string
  attr?: string
  width?: string | number
  height?: string | number
  returnAspectRatio?: boolean
  lazy?: boolean
  max?: number
}

const getImage = (args: Args = {}): string | { output: string, aspectRatio: number } => {
  const {
    data,
    classes = '',
    attr = '',
    width = 'auto',
    height = 'auto',
    returnAspectRatio = false,
    lazy = true,
    max = 1600
  } = args

  /* Data required */

  if (data == null) {
    return ''
  }

  const {
    base = '',
    alt = '',
    width: naturalWidth,
    height: naturalHeight
  } = data

  if (base === '') {
    return ''
  }

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

  /* Src and sizes attributes */

  const src = `/assets/img/${base}.webp`
  const size = w <= max ? w : max
  const sizes = `(min-width: ${size / 16}rem) ${size / 16}rem, 100vw`

  let srcset: string[] | number[] = [200, 400, 600, 800, 1200, 1600, 2000]

  srcset = srcset.filter(s => s < w && s <= max)

  if (w <= max) {
    srcset.push(w)
  }

  srcset = srcset.map(s => {
    return `/assets/img/${base}${s !== naturalWidth ? `@${s}` : ''}.webp ${s}w`
  })

  /* Output */

  const output = `
    <img${classes !== '' ? ` class="${classes}"` : ''} alt="${alt}" src="${src}" srcset="${srcset.join(', ')}" sizes="${sizes}" width="${w}" height="${h}"${attr !== '' ? ` ${attr}` : ''}${lazy ? ' loading="lazy" decoding="async"' : ''}>
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
