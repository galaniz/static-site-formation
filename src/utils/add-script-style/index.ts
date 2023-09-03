/**
 * Utils - add script style
 */

/* Imports */

import config from '../../config'

/**
 * Function - set scripts and styles paths in config
 *
 * @param {object} args
 * @param {string} args.dir
 * @param {boolean} args.script
 * @param {boolean} args.style
 * @param {number} args.priority
 * @return {void}
 */

interface AddScriptStyle {
  dir: string
  script?: boolean
  style?: boolean
  priority?: number
}

const addScriptStyle = ({ dir = '', script = false, style = false, priority = 10 }: AddScriptStyle): void => {
  if (dir === '') {
    return
  }

  const scriptOut = `js/${dir}/index`
  const styleOut = `css/${dir}/index`

  dir = `src/${dir}/`

  if (script) {
    const scripts = config.scripts

    if (scripts.item[scriptOut] === undefined) {
      scripts.item[scriptOut] = priority
    }

    scripts.build[scriptOut] = `${dir}scripts/index.js`
  }

  if (style) {
    const styles = config.styles

    if (styles.item[styleOut] === undefined) {
      styles.item[styleOut] = priority
    }

    styles.build[styleOut] = `${dir}styles/_index.scss`
  }
}

/* Exports */

export default addScriptStyle
