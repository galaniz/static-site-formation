/**
 * Serverless - ajax
 */

/* Imports */

import config, { setConfig } from '../../config'
import sendForm from '../send-form'

/**
 * Function - normalize inputs body data to reflect nested structures
 *
 * @private
 * @param {object} data
 * @return {object}
 */

interface _AjaxNormalData extends FRM.AjaxActionData {
  action?: string
}

const _normalizeBody = (data: object = {}): _AjaxNormalData => {
  const normalData = {
    id: '',
    inputs: {}
  }

  Object.keys(data).forEach((d) => {
    if (d.startsWith('inputs')) {
      const key = d.replace('inputs', '').replace('][', '.').replace('[', '').replace(']', '')
      const keys = key.split('.')
      const lastIndex = keys.length - 1
      const obj = {}

      let lastLevel = obj

      keys.forEach((k, i) => {
        if (i === 0) {
          return
        }

        if (lastLevel?.[k] === undefined) {
          lastLevel[k] = i === lastIndex ? data[d] : {}
        }

        lastLevel = obj[k]
      })

      if (normalData.inputs?.[keys[0]] !== undefined) {
        const existingObj = normalData.inputs?.[keys[0]]

        Object.keys(obj).forEach((o) => {
          existingObj[o] = obj[o]
        })
      } else {
        normalData.inputs[keys[0]] = obj
      }
    } else {
      normalData[d] = data[d]
    }
  })

  return normalData
}

/**
 * Function - custom exception to include status code
 *
 * @private
 * @param {object} args
 * @param {string} args.message
 * @param {number} args.code
 * @return {void}
 */

function CustomError ({ message = '', code = 500 }: { message: string, code: number }): void {
  this.message = message
  this.httpStatusCode = code
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
  request: any
  env: any
  siteConfig: FRM.Config
}

const ajax = async ({ request, env, siteConfig }: AjaxArgs): Promise<object> => {
  try {
    /* Config */

    setConfig(siteConfig)

    config.env.dev = env.ENVIRONMENT === 'dev'
    config.env.prod = env.ENVIRONMENT === 'production'

    /* Get form data */

    const formData = await request.formData()
    const body = {}

    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }

    const data = _normalizeBody(body)

    /* Inputs required */

    if (data?.inputs === undefined) {
      throw new Error('No inputs')
    }

    /* Honeypot check */

    const honeypotName = `${config.namespace}_asi`

    if (data.inputs?.[honeypotName] !== undefined) {
      const honeypotValue = data.inputs[honeypotName].value

      if (honeypotValue !== '' && honeypotValue !== undefined) {
        return new Response(JSON.stringify({ success: 'Form successully sent.' }), {
          status: 200
        })
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

    if (config.ajaxFunctions?.[action] !== undefined && typeof config.ajaxFunctions?.[action] === 'function') {
      res = await config.ajaxFunctions[action]({ ...data, env, request })
    }

    /* Result error */

    if (res === null) {
      throw new Error('No result')
    }

    if (res?.error !== undefined && typeof res?.error === 'string') {
      throw new CustomError(res.error)
    }

    /* Result success */

    const options: { status: number, headers?: any } = {
      status: 200
    }

    let message = ''

    if (res.success !== undefined) {
      const { message: successMessage, headers } = res.success

      if (successMessage !== undefined) {
        message = successMessage
      }

      if (headers !== undefined) {
        options.headers = headers
      }
    }

    return new Response(message, options)
  } catch (error) {
    console.error(config.console.red, '[SSF] Error with ajax function: ', error)

    const statusCode = typeof error.httpStatusCode === 'number' ? error.httpStatusCode : 500

    return new Response(error.message, {
      status: statusCode
    })
  }
}

/* Exports */

export default ajax
