/**
 * Serverless - Types
 */

/* Imports */

import { Generic } from '../../global/types/types'

/**
 * @typedef EnvCloudflare
 * @type {Generic}
 * @prop {string} [ENVIRONMENT]
 * @prop {string} [SMPT2GO_API_KEY]
 */
export interface EnvCloudflare extends Generic {
  ENVIRONMENT?: string
  SMPT2GO_API_KEY?: string
}

/**
 * @typedef {object} AjaxActionInput
 * @prop {string} type
 * @prop {string} label
 * @prop {string|string[]} value
 * @prop {string} [legend]
 * @prop {boolean} [exclude]
 */
export interface AjaxActionInput {
  type: string
  label: string
  value: string | string[]
  legend?: string
  exclude?: boolean
}

/**
 * @typedef {object} AjaxActionData
 * @prop {string} id
 * @prop {Object.<string, AjaxActionInput>} inputs
 */
export interface AjaxActionData {
  id: string
  inputs: {
    [key: string]: AjaxActionInput
  }
}

/**
 * @typedef AjaxActionArgs
 * @type {AjaxActionData}
 * @prop {EnvCloudflare} env
 * @prop {Request} request
 */
export interface AjaxActionArgs extends AjaxActionData {
  env: EnvCloudflare
  request: Request
}

/**
 * @typedef {object} AjaxActionReturn
 * @prop {object} [error]
 * @prop {string} error.message
 * @prop {number} error.code
 * @prop {object} [success]
 * @prop {string} success.message
 * @prop {Object.<string, string>} [headers]
 */
export interface AjaxActionReturn {
  error?: {
    message: string
    code?: number
  }
  success?: {
    message: string
    headers?: {
      [key: string]: string
    }
  }
}

/**
 * @typedef {object} CustomErrorObject
 * @prop {number} [httpStatusCode]
 * @prop {string} [message]
 */
export interface CustomErrorObject {
  httpStatusCode?: number
  message?: string
}
