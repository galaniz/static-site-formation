/**
 * Serverless - Reload
 */

/* Imports */

import { config, setConfig } from '../../config/config'
import { getAllContentfulData } from '../../utils/getAllContentfulData/getAllContentfulData'
import { Render } from '../../render/Render'

/**
 * Function - output paginated and/or filtered page on browser reload
 *
 * @param {object} args
 * @param {object} args.request
 * @param {object} args.env
 * @param {function} args.next
 * @param {object} args.siteConfig
 * @return {object} Response
 */

interface ReloadArgs {
  request: Request
  env: FRM.EnvCloudflare
  next: Function
  siteConfig: FRM.Config
}

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

    if (typeof env === 'object' && env !== undefined && env !== null) {
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

    if (!Array.isArray(data)) {
      html = data?.output !== undefined ? data.output : ''
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error: any) {
    console.error(config.console.red, '[SSF] Error with reload function: ', error)

    const statusCode = typeof error.httpStatusCode === 'number' ? error.httpStatusCode : 500

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
