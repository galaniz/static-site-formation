/**
 * Serverless - reload
 */

/* Imports */

import render from '../render'
import httpError from '../render/http-error'
import getContentfulDataServerless from '../utils/get-contentful-data-serverless'

/**
 * Function - output paginated and/or filtered page on browser reload
 *
 * @private
 * @param {object} {
 *  @prop {object} request
 *  @prop {object} env
 * }
 * @return {object} Response
 */

const reload = async ({ request, env }) => {
  try {
    /* Query */

    const { searchParams, pathname } = new URL(request.url)
    const page = searchParams.get('page')
    const filters = searchParams.get('filters')
    const path = pathname
    const query = {}

    if (page) {
      query.page = page
    }

    if (filters) {
      query.filters = filters
    }

    const data = await render({
      serverlessData: { query, path },
      getContentfulData: getContentfulDataServerless,
      env: {
        dev: env.ENVIRONMENT === 'dev',
        prod: env.ENVIRONMENT === 'production',
        ctfl: {
          spaceId: env.CTFL_SPACE_ID,
          cpaToken: env.CTFL_CPA_TOKEN,
          cdaToken: env.CTFL_CDA_TOKEN
        }
      }
    })

    /* Output */

    const html = data?.output ? data.output : ''

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html;charset=UTF-8'
      }
    })
  } catch (error) {
    console.error('Error with reload function: ', error)

    return new Response(httpError('500'), {
      status: error.httpStatusCode || 500
    })
  }
}

/* Export */

export default reload
