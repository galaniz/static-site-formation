/**
 * Functions - ajax
 */

/* Imports */

import sendForm from '../../src/serverless/send-form'
import { enumNamespace } from '../../src/vars/enums'
import { envData } from '../../src/vars/data'

/**
 * Function - normalize inputs body data to reflect nested structures
 *
 * @private
 * @param {object} data
 * @return {object}
 */

const _normalizeBody = (data = {}) => {
  const normalData = {
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

        if (!lastLevel?.[k]) {
          lastLevel[k] = i === lastIndex ? data[d] : {}
        }

        lastLevel = obj[k]
      })

      if (normalData.inputs?.[keys[0]]) {
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
 * Function - set env variables, normalize request body, check for required props and call actions
 *
 * @param {object} context
 * @param {object} context.request
 * @param {object} context.env
 * @return {object}
 */

const ajax = async ({ request, env }) => {
  try {
    /* Set env data */

    envData.dev = env.ENVIRONMENT === 'dev'
    envData.prod = env.ENVIRONMENT === 'production'
    envData.smtp2go.apiKey = env.SMPT2GO_API_KEY
    envData.ctfl = {
      spaceId: env.CTFL_SPACE_ID,
      cpaToken: env.CTFL_CPA_TOKEN,
      cdaToken: env.CTFL_CDA_TOKEN
    }

    /* Get form data */

    const formData = await request.formData()
    const body = {}

    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }

    const data = _normalizeBody(body)

    /* Inputs required */

    if (!data?.inputs) {
      throw new Error('No inputs')
    }

    /* Honeypot check */

    const honeypotName = `${enumNamespace}_asi`

    if (data.inputs?.[honeypotName]) {
      if (data.inputs[honeypotName].value) {
        return new Response(JSON.stringify({ success: 'Form successully sent.' }), {
          status: 200
        })
      }

      delete data.inputs[honeypotName]
    }

    /* Id required */

    if (!data?.id) {
      throw new Error('No id')
    }

    /* Action required */

    const action = data?.action ? data.action : ''

    if (!action) {
      throw new Error('No action')
    }

    /* Call functions by action */

    let res

    if (action === 'sendForm') {
      res = await sendForm(data)
    }

    /* Result */

    if (!res) {
      throw new Error('No result')
    }

    if (res?.error) {
      throw new Error(res.error)
    }

    return new Response(JSON.stringify(res), {
      status: 200
    })
  } catch (error) {
    console.error('Error with ajax function: ', error)

    return new Response(error.message, {
      status: error.httpStatusCode || 500
    })
  }
}

/* Exports */

export const onRequestPost = [ajax]
