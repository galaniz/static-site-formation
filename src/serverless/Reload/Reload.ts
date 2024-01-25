/**
 * Serverless - Reload
 */

/* Imports */

import type { ReloadArgs, ReloadQuery } from './ReloadTypes'
import { config, setConfig } from '../../config/config'
import { getAllContentfulData, isArray, isObjectStrict, isNumber } from '../../utils'
import { Render } from '../../render/Render'

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
    const query: ReloadQuery = {}

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

    if (isObjectStrict(env)) {
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
      html = data.output !== undefined ? data.output : ''
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

    if (isObjectStrict(error) && isNumber(error.httpStatusCode)) {
      statusCode = error.httpStatusCode
    }

    let html = ''

    if (config.renderFunctions.httpError !== undefined) {
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
