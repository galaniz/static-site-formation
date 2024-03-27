/**
 * Utils - Data Source
 */

/* Imports */

import type { DataSource } from './dataSourceTypes'
import { isStringStrict } from '../isString/isString'
import { config } from '../../config/config'

/**
 * Check and get data source
 *
 * @type {import('./dataSourceTypes').DataSource}
 */
const dataSource: DataSource = {
  isContentful (source = config.source) {
    return config.cms.name === 'contentful' && source === 'cms'
  },
  isStatic (source = config.source) {
    return source === 'static'
  },
  get () {
    const cmsName = config.cms.name

    if (isStringStrict(cmsName)) {
      return cmsName
    }

    return config.source
  }
}

/* Exports */

export { dataSource }
