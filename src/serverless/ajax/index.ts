/**
 * Serverless - ajax
 */

/* Imports */

import { setConfig } from '../../config'
import { setActions } from '../../utils/actions'
import { applyFilters, setFilters } from '../../utils/filters'
import sendForm from '../send-form'

/**
 * Class - custom exception to include status code
 *
 * @private
 */

class _CustomError extends Error {
  /**
   * Set properties
   *
   * @param {object} args
   * @param {string} args.message
   * @param {number} args.code
   * @return {void}
   */

  public message: string
  public httpStatusCode: number

  constructor ({ message = '', code = 500 }) {
    super(message)
    this.message = message
    this.httpStatusCode = code
  }
}

/**
 * Function - set env variables, normalize request body, check for required props and call actions
 *
 * @param {object} args
 * @param {object} args.request
 * @param {object} args.env
 * @param {object} args.siteConfig
 * @return {object} Response
 */

interface AjaxArgs {
  request: Request
  env: FRM.EnvCloudflare
  siteConfig: FRM.Config
}

const ajax = async ({ request, env, siteConfig }: AjaxArgs): Promise<Response> => {
  try {
    /* Config */

    setConfig(siteConfig)
    setFilters(siteConfig.filters)
    setActions(siteConfig.actions)

    if (typeof env === 'object' && env !== undefined && env !== null) {
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

    if (data?.id === undefined || data?.id === '') {
      throw new Error('No id')
    }

    /* Action required */

    const action = data?.action !== undefined ? data.action : ''

    if (action === undefined || action === '') {
      throw new Error('No action')
    }

    /* Call functions by action */

    let res: FRM.AjaxActionReturn | null = null

    if (action === 'sendForm') {
      res = await sendForm({ ...data, env, request })
    }

    if (siteConfig.ajaxFunctions?.[action] !== undefined) {
      res = await siteConfig.ajaxFunctions[action]({ ...data, env, request })
    }

    const ajaxResFilterArgs: FRM.AjaxActionArgs = {
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

    if (res?.error !== undefined && typeof res?.error === 'string') {
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
  } catch (error: any) {
    console.error(siteConfig.console.red, '[SSF] Error with ajax function: ', error)

    const options = {
      status: typeof error.httpStatusCode === 'number' ? error.httpStatusCode : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return new Response(JSON.stringify({ error: error.message }), options)
  }
}

/* Exports */

export default ajax
