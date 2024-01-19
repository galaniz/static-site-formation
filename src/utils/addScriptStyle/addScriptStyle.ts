/**
 * Utils - Add Script Style
 */

/* Imports */

import { config } from '../../config/config'

/**
 * Function - set scripts and styles paths in config
 *
 * @param {object} args
 * @param {string} args.dir
 * @param {string} args.script
 * @param {string} args.style
 * @param {number} args.priority
 * @return {void}
 */

interface AddScriptStyle {
  dir: string
  script?: string
  style?: string
  priority?: number
}

const addScriptStyle = ({ dir = '', script = '', style = '', priority = 10 }: AddScriptStyle): void => {
  if (dir === '') {
    return
  }

  let scriptOut = `js/${dir}/`
  let styleOut = `css/${dir}/`

  dir = `src/${dir}/`

  if (script !== '') {
    scriptOut = `${scriptOut}${script}`

    const scripts = config.scripts

    if (scripts.item[scriptOut] === undefined) {
      scripts.item[scriptOut] = priority
    }

    scripts.build[scriptOut] = `${dir}${script}.js`
  }

  if (style !== '') {
    styleOut = `${styleOut}${style}`

    const styles = config.styles

    if (styles.item[styleOut] === undefined) {
      styles.item[styleOut] = priority
    }

    styles.build[styleOut] = `${dir}${style}.scss`
  }
}

/* Exports */

export { addScriptStyle }
