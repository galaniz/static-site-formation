/**
 * Serverless - Reload
 */

/* Imports */

import type { ReloadArgs, ReloadQuery } from './ReloadTypes'
import type { CustomErrorObject } from '../serverlessTypes'
import { config, setConfig } from '../../config/config'
import { getAllContentfulData } from '../../utils/getAllContentfulData/getAllContentfulData'
import {
  isObjectStrict,
  isStringStrict,
  isNumber,
  setFilters,
  setActions,
  setShortcodes,
  isFunction
} from '../../utils/utils'
import { Render } from '../../render/Render'

/**
 * Function - output paginated and/or filtered page on browser reload
 *
 * @param {import('./ReloadTypes').ReloadArgs} args
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

    let noPage = false
    let noFilters = false

    if (isStringStrict(page)) {
      query.page = page
    } else {
      noPage = true
    }

    if (isStringStrict(filters)) {
      query.filters = filters
    } else {
      noFilters = true
    }

    /* No query move on to default page */

    if (noPage || noFilters) {
      return next()
    }

    /* Config */

    setConfig(siteConfig)
    setFilters(siteConfig.filters)
    setActions(siteConfig.actions)
    setShortcodes(siteConfig.shortcodes)

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

    if (isObjectStrict(data)) {
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

    if (isObjectStrict(error)) {
      const err: CustomErrorObject = error

      if (isNumber(err.httpStatusCode)) {
        statusCode = err.httpStatusCode
      }
    }

    let html = ''

    if (isFunction(config.renderFunctions.httpError)) {
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
