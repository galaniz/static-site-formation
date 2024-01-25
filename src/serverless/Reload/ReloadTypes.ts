/**
 * Serverless - Reload Types
 */

/* Imports */

import type { EnvCloudflare } from '../serverlessTypes'
import type { Config } from '../../config/configTypes'
import type { Generic } from '../../global/globalTypes'

/**
 * @typedef {object} ReloadArgs
 * @prop {Request} request
 * @prop {EnvCloudflare} env
 * @prop {function} next
 * @prop {Config} siteConfig
 */
export interface ReloadArgs {
  request: Request
  env: EnvCloudflare
  next: Function
  siteConfig: Config
}

/**
 * @typedef ReloadQuery
 * @type { Generic}
 * @prop {string} [page]
 * @prop {string} [filters]
 */
export interface ReloadQuery extends Generic {
  page?: string
  filters?: string
}
