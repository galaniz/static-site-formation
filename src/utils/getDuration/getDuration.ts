/**
 * Utils - Get Duration
 */

/**
 * Function - get seconds as text
 *
 * @param {number} seconds
 * @param {boolean} words
 * @return {string}
 */
const getDuration = (seconds: number = 0, words: boolean = false): string => {
  const hours = Math.floor(seconds / 3600)
  const min = Math.floor((seconds - (hours * 3600)) / 60)

  seconds = seconds - (hours * 3600) - (min * 60)

  let t = ''

  if (!words) {
    if (hours !== 0) {
      t += `${hours < 10 && hours > 0 ? '0' : ''}${hours}:`
    }

    t += `${hours !== 0 && min < 10 ? '0' : ''}${min}:`

    t += `${seconds < 10 ? '0' : ''}${seconds}`
  } else {
    if (hours !== 0) {
      t += `${hours}${hours > 1 ? ' hours' : ' hour'}${min !== 0 ? ' ' : ''}`
    }

    if (min !== 0) {
      t += `${min}${min > 1 ? ' minutes' : ' minute'}${seconds !== 0 ? ' ' : ''}`
    }

    if (seconds !== 0) {
      t += `${seconds}${seconds > 1 ? ' seconds' : ' second'}`
    }
  }

  return t
}

/* Exports */

export { getDuration }
