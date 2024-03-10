/**
 * Serverless - Preview Types
 */

/* Imports */

import type { GenericStrings } from '../../global/globalTypes'
import type { Config } from '../../config/configTypes'

/**
 * @typedef {object} PreviewArgs
 * @prop {Request} request
 * @prop {function} next
 * @prop {import('../../global/globalTypes').GenericStrings} env
 * @prop {import('../../config/configTypes').Config} siteConfig
 */
export interface PreviewArgs {
  request: Request
  next: Function
  env: GenericStrings
  siteConfig: Config
}
