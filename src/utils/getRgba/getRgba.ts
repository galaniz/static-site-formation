/**
 * Utils - Get Rgba
 */

/**
 * Alpha value from hex code partial
 *
 * @private
 * @type {Object.<string, number>}
 */
const _alphaCodes: { [key: string]: number } = {
  FF: 1,
  FC: 0.99,
  FA: 0.98,
  F7: 0.97,
  F5: 0.96,
  F2: 0.95,
  F0: 0.94,
  ED: 0.93,
  EB: 0.92,
  E8: 0.91,
  E6: 0.9,
  E3: 0.89,
  E0: 0.88,
  DE: 0.87,
  DB: 0.86,
  D9: 0.85,
  D6: 0.84,
  D4: 0.83,
  D1: 0.82,
  CF: 0.81,
  CC: 0.8,
  C9: 0.79,
  C7: 0.78,
  C4: 0.77,
  C2: 0.76,
  BF: 0.75,
  BD: 0.74,
  BA: 0.73,
  B8: 0.72,
  B5: 0.71,
  B3: 0.7,
  B0: 0.69,
  AD: 0.68,
  AB: 0.67,
  A8: 0.66,
  A6: 0.65,
  A3: 0.64,
  A1: 0.63,
  '9E': 0.62,
  '9C': 0.61,
  99: 0.6,
  96: 0.59,
  94: 0.58,
  91: 0.57,
  '8F': 0.56,
  '8C': 0.55,
  '8A': 0.54,
  87: 0.53,
  85: 0.52,
  82: 0.51,
  80: 0.5,
  '7D': 0.49,
  '7A': 0.48,
  78: 0.47,
  75: 0.46,
  73: 0.45,
  70: 0.44,
  '6E': 0.43,
  '6B': 0.42,
  69: 0.41,
  66: 0.4,
  63: 0.39,
  61: 0.38,
  '5E': 0.37,
  '5C': 0.36,
  59: 0.35,
  57: 0.34,
  54: 0.33,
  52: 0.32,
  '4F': 0.31,
  '4D': 0.3,
  '4A': 0.29,
  47: 0.28,
  45: 0.27,
  42: 0.26,
  40: 0.25,
  '3D': 0.24,
  '3B': 0.23,
  38: 0.22,
  36: 0.21,
  33: 0.2,
  30: 0.19,
  '2E': 0.18,
  '2B': 0.17,
  29: 0.16,
  26: 0.15,
  24: 0.14,
  21: 0.13,
  '1F': 0.12,
  '1C': 0.11,
  '1A': 0.1,
  17: 0.09,
  14: 0.08,
  12: 0.07,
  '0F': 0.06,
  '0D': 0.05,
  '0A': 0.04,
  '08': 0.03,
  '05': 0.02,
  '03': 0.01,
  '00': 0
}

/**
 * Function - get rgba from hex color string
 *
 * @param {string} hex
 * @param {float} alpha
 * @param {boolean} returnArray
 * @return {number[]|string}
 */
const getRgba = (
  hex: string = '',
  alpha: number = 1,
  returnArray: boolean = false
): number[] | string => {
  let r = 0
  let g = 0
  let b = 0
  let a = alpha

  r = +`0x${hex[1]}${hex[2]}`
  g = +`0x${hex[3]}${hex[4]}`
  b = +`0x${hex[5]}${hex[6]}`

  if (hex.length === 9) {
    a = _alphaCodes[(hex[7] + hex[8]).toUpperCase()]
  }

  if (returnArray) {
    return [r, g, b, a]
  }

  return [r, g, b, a].join(', ')
}

/* Exports */

export { getRgba }
