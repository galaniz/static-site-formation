/**
 * Serverless - Preview Types
 */

/* Imports */

import type { Config } from '../../config/configTypes'

/**
 * @typedef {object} PreviewArgs
 * @prop {Request} request
 * @prop {function} next
 * @prop {import('../../config/configTypes').Config} siteConfig
 */
export interface PreviewArgs {
  request: Request
  next: Function
  siteConfig: Config
}
