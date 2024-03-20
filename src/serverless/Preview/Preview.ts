/**
 * Serverless - Preview
 */

/* Imports */

import type { PreviewArgs } from './PreviewTypes'
import { setConfig, setConfigFilter } from '../../config/config'
import { getAllContentfulData } from '../../utils/getAllContentfulData/getAllContentfulData'
import {
  isObjectStrict,
  isStringStrict,
  setFilters,
  setActions,
  setShortcodes
} from '../../utils/utils'
import { render } from '../../render/render'

/**
 * Function - output preview from contentful
 *
 * @param {import('./PreviewTypes').PreviewArgs} args
 * @return {Promise<Response>} Response
 */
const Preview = async ({ request, next, env, siteConfig }: PreviewArgs): Promise<Response> => {
  /* Params */

  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('content_type')
  const id = searchParams.get('preview')

  /* Preview id and content type required */

  if (!isStringStrict(id) || !isStringStrict(contentType)) {
    return next()
  }

  /* Config */

  setConfig(siteConfig)

  await setConfigFilter(env)

  setFilters(siteConfig.filters)
  setActions(siteConfig.actions)
  setShortcodes(siteConfig.shortcodes)

  /* Data params */

  const previewData = { id, contentType }

  /* Output */

  const data = await render({
    previewData,
    allData: await getAllContentfulData({
      previewData
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
}

/* Export */

export { Preview }
