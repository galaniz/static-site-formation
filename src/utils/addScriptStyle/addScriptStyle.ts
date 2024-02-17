/**
 * Utils - Add Script Style
 */

/* Imports */

import type { ScriptStyleArgs } from './addScriptStyleTypes'
import { config } from '../../config/config'

/**
 * Function - set scripts and styles paths in config
 *
 * @param {import('./addScriptStyleTypes').ScriptStyleArgs} args
 * @return {void}
 */
const addScriptStyle = ({ dir = '', script = '', style = '', priority = 10 }: ScriptStyleArgs): void => {
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
