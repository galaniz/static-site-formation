/**
 * Utils - Get Path Depth
 */

/**
 * Function - relative ascendent path as string
 *
 * @param {string} path
 * @return {string}
 */
const getPathDepth = (path: string = ''): string => {
  let pathDepth = path.split('/')

  pathDepth.pop()

  pathDepth = pathDepth.map(() => {
    return '../'
  })

  return pathDepth.join('')
}

/* Exports */

export { getPathDepth }
