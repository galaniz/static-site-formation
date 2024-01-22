/**
 * Serverless - Reload
 */

/* Imports */

import type { EnvCloudflare, CustomErrorObject } from '../types/types'
import type { Config } from '../../config/config'
import { config, setConfig } from '../../config/config'
import { getAllContentfulData, isObject, isArray } from '../../utils'
import { Render } from '../../render/Render'

/**
 * @typedef {object} ReloadArgs
 * @prop {Request} request
 * @prop {EnvCloudflare} env
 * @prop {function} next
 * @prop {Config} siteConfig
 */
interface ReloadArgs {
  request: Request
  env: EnvCloudflare
  next: Function
  siteConfig: Config
}

/**
 * Function - output paginated and/or filtered page on browser reload
 *
 * @param {ReloadArgs} args
 * @return {Promise<Response>} Response
 */
const Reload = async ({ request, env, next, siteConfig }: ReloadArgs): Promise<Response> => {
  try {
    /* Query */

    const { searchParams, pathname } = new URL(request.url)
    const page = searchParams.get('page')
    const filters = searchParams.get('filters')
    const path = pathname
    const query: { page?: string, filters?: string } = {}

    if (page !== null) {
      query.page = page
    }

    if (filters !== null) {
      query.filters = filters
    }

    /* No query move on to default page */

    if (page === null || filters === null) {
      return next()
    }

    /* config */

    setConfig(siteConfig)

    if (isObject(env)) {
      config.env.dev = env.ENVIRONMENT === 'dev'
      config.env.prod = env.ENVIRONMENT === 'production'
    }

    /* Data params */

    const serverlessData = { query, path }

    /* Output */

    const data = await Render({
      serverlessData,
      allData: await getAllContentfulData({
        serverlessData
      })
    })

    let html = ''

    if (!isArray(data)) {
      html = data?.output !== undefined ? data.output : ''
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error) {
    console.error(config.console.red, '[SSF] Error with reload function: ', error)

    let statusCode = 500

    if (isObject(error)) {
      const errorObj = error as CustomErrorObject

      if (typeof errorObj.httpStatusCode === 'number') {
        statusCode = errorObj.httpStatusCode
      }
    }

    let html = ''

    if (config.renderFunctions?.httpError !== undefined) {
      html = await config.renderFunctions.httpError(statusCode)
    }

    return new Response(html, {
      status: statusCode,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  }
}

/* Export */

export { Reload }
