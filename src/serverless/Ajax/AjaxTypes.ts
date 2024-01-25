/**
 * Serverless - Ajax Types
 */

import type { EnvCloudflare } from '../serverlessTypes'
import type { Config } from '../../config/configTypes'

/**
 * @typedef {object} AjaxArgs
 * @prop {Request} request
 * @prop {EnvCloudflare} env
 * @prop {Config} siteConfig
 */
export interface AjaxArgs {
  request: Request
  env: EnvCloudflare
  siteConfig: Config
}

/**
 * @typedef {object} AjaxCustomErrorArgs
 * @prop {string} [message]
 * @prop {number} [code]
 */
export interface AjaxCustomErrorArgs {
  message?: string
  code?: number
}

/**
 * @typedef {object} AjaxResOptions
 * @prop {number} status
 * @prop {Object.<string, string>} [headers]
 */
export interface AjaxResOptions {
  status: number
  headers?: {
    [key: string]: string
  }
}
