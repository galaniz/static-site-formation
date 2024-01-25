/**
 * Utils - Get Hue
 */

/* Imports */

import { getRgba } from '../getRgba/getRgba'
import { isString } from '../isString/isString'

/**
 * Function - get hue from hex color string
 *
 * Source - https://css-tricks.com/converting-color-spaces-in-javascript/#aa-hex-to-hsl
 *
 * @param {string} hex
 * @param {float} alpha
 * @return {number}
 */
const getHue = (hex: string = '', alpha: number = 1): number => {
  let [r, g, b] = getRgba(hex, alpha, true)

  if (isString(r) || isString(g) || isString(b)) {
    return 0
  }

  r /= 255
  g /= 255
  b /= 255

  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin

  let h = 0

  if (delta === 0) {
    h = 0
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6
  } else if (cmax === g) {
    h = (b - r) / delta + 2
  } else {
    h = (r - g) / delta + 4
  }

  h = Math.round(h * 60)

  if (h < 0) {
    h += 360
  }

  return h
}

/* Exports */

export { getHue }
