/**
 * Serverless - reload
 */

/* Imports */

import { config, setConfig } from '../../config'
import getAllContentfulData from '../../utils/get-all-contentful-data'
import render from '../../render'

/**
 * Function - output paginated and/or filtered page on browser reload
 *
 * @param {object} args
 * @param {object} args.request
 * @param {object} args.env
 * @param {function} args.next
 * @param {object} args.siteConfig
 * @return {object}
 */

interface ReloadArgs {
  request: any
  env: any
  next: any
  siteConfig: Formation.Config
}

const reload = async ({ request, env, next, siteConfig }: ReloadArgs): Promise<object> => {
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

    /* Config */

    setConfig(siteConfig)

    config.env.dev = env.ENVIRONMENT === 'dev'
    config.env.prod = env.ENVIRONMENT === 'production'

    /* Data params */

    const serverlessData = { query, path }

    /* Output */

    const data = await render({
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
        'content-type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error) {
    console.error('Error with reload function: ', error)

    const statusCode = typeof error.httpStatusCode === 'number' ? error.httpStatusCode : 500

    let html = ''

    if (config.renderFunctions?.httpError !== undefined) {
      html = config.renderFunctions.httpError(statusCode)
    }

    return new Response(html, {
      status: statusCode
    })
  }
}

/* Export */

export default reload
