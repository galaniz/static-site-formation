/**
 * Serverless - Ajax
 */

/* Imports */

import type {
  EnvCloudflare,
  AjaxActionReturn,
  AjaxActionArgs,
  CustomErrorObject
} from '../types/types'
import type { Config } from '../../config/config'
import { setConfig } from '../../config/config'
import {
  setActions,
  applyFilters,
  setFilters,
  isObject,
  isStringStrict
} from '../../utils'
import { SendForm } from '../SendForm/SendForm'

/**
 * @typedef {object} AjaxArgs
 * @prop {Request} request
 * @prop {EnvCloudflare} env
 * @prop {Config} siteConfig
 */
interface AjaxArgs {
  request: Request
  env: EnvCloudflare
  siteConfig: Config
}

/**
 * Class - custom exception to include status code
 *
 * @private
 */
class _CustomError extends Error {
  /**
   * Store message
   *
   * @type {string}
   */
  message: string

  /**
   * Store status code
   *
   * @type {number}
   */
  httpStatusCode: number

  /**
   * Set properties
   *
   * @param {object} args
   * @param {string} [args.message]
   * @param {number} [args.code]
   */
  constructor (args: { message?: string, code?: number }) {
    if (!isObject(args)) {
      args = {}
    }

    const { message = '', code = 500 } = args

    super(message)
    this.message = message
    this.httpStatusCode = code
  }
}

/**
 * Function - set env variables, normalize request body, check for required props and call actions
 *
 * @param {AjaxArgs} args
 * @return {Promise<Response>} Response
 */

const Ajax = async ({ request, env, siteConfig }: AjaxArgs): Promise<Response> => {
  try {
    /* config */

    setConfig(siteConfig)
    setFilters(siteConfig.filters)
    setActions(siteConfig.actions)

    if (isObject(env)) {
      siteConfig.env.dev = env.ENVIRONMENT === 'dev'
      siteConfig.env.prod = env.ENVIRONMENT === 'production'
      siteConfig.apiKeys.smtp2go = env.SMPT2GO_API_KEY !== undefined ? env.SMPT2GO_API_KEY : ''
    }

    /* Get form data */

    const data = await request.json()

    /* Inputs required */

    if (data?.inputs === undefined) {
      throw new Error('No inputs')
    }

    /* Honeypot check */

    const honeypotName = `${siteConfig.namespace}_asi`

    if (data.inputs?.[honeypotName] !== undefined) {
      const honeypotValue = data.inputs[honeypotName].value

      if (honeypotValue !== '' && honeypotValue !== undefined) {
        const options = {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }

        return new Response(JSON.stringify({ success: 'Form successully sent' }), options)
      }

      data.inputs[honeypotName].exclude = true
    }

    /* Id required */

    if (!isStringStrict(data.id)) {
      throw new Error('No id')
    }

    /* Action required */

    const action = data?.action !== undefined ? data.action : ''

    if (!isStringStrict(action)) {
      throw new Error('No action')
    }

    /* Call functions by action */

    let res: AjaxActionReturn | null = null

    if (action === 'sendForm') {
      res = await SendForm({ ...data, env, request })
    }

    if (siteConfig.ajaxFunctions?.[action] !== undefined) {
      res = await siteConfig.ajaxFunctions[action]({ ...data, env, request })
    }

    const ajaxResFilterArgs: AjaxActionArgs = {
      action,
      ...data,
      env,
      request
    }

    res = await applyFilters('ajaxRes', res, ajaxResFilterArgs)

    /* Result error */

    if (res === null) {
      throw new Error('No result')
    }

    if (isStringStrict(res.error)) {
      throw new _CustomError(res.error)
    }

    /* Result success */

    const options: { status: number, headers?: { [key: string]: string } } = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    let message = ''

    if (res.success !== undefined) {
      const { message: successMessage, headers } = res.success

      if (successMessage !== undefined) {
        message = successMessage
      }

      if (headers !== undefined) {
        options.headers = { ...options.headers, ...headers }
      }
    }

    return new Response(JSON.stringify({ success: message }), options)
  } catch (error) {
    console.error(siteConfig.console.red, '[SSF] Error with ajax function: ', error)

    let statusCode = 500
    let message = ''

    if (isObject(error)) {
      const errorObj = error as CustomErrorObject

      if (typeof errorObj.httpStatusCode === 'number') {
        statusCode = errorObj.httpStatusCode
      }

      if (isStringStrict(errorObj.message)) {
        message = errorObj.message
      }
    }

    const options = {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return new Response(JSON.stringify({ error: message }), options)
  }
}

/* Exports */

export { Ajax }
