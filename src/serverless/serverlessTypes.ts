/**
 * Serverless - Types
 */

/* Imports */

import type { GenericStrings } from '../global/globalTypes'

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
 * @prop {import('../global/globalTypes').GenericStrings} env
 * @prop {Request} request
 */
export interface AjaxActionArgs extends AjaxActionData {
  env: GenericStrings
  request: Request
}

/**
 * @typedef {object} AjaxActionReturn
 * @prop {object} [error]
 * @prop {string} error.message
 * @prop {number} error.code
 * @prop {object} [success]
 * @prop {string} success.message
 * @prop {import('../global/globalTypes').GenericStrings} [headers]
 */
export interface AjaxActionReturn {
  error?: {
    message: string
    code?: number
  }
  success?: {
    message: string
    headers?: GenericStrings
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
