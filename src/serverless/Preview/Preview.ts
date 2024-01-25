/**
 * Serverless - Preview
 */

/* Imports */

import type { PreviewArgs } from './PreviewTypes'
import { config, setConfig } from '../../config/config'
import { getAllContentfulData, isArray, isStringStrict } from '../../utils'
import { Render } from '../../render/Render'

/**
 * Function - output preview from contentful
 *
 * @param {PreviewArgs} args
 * @return {Promise<Response>} Response
 */
const Preview = async ({ request, next, siteConfig }: PreviewArgs): Promise<Response> => {
  /* Params */

  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('content_type')
  const id = searchParams.get('preview')

  /* Preview id and content type required */

  if (!isStringStrict(id) || !isStringStrict(contentType)) {
    return next()
  }

  /* config */

  setConfig(siteConfig)

  config.env.dev = true
  config.env.prod = false

  /* Data params */

  const previewData = { id, contentType }

  /* Output */

  const data = await Render({
    previewData,
    allData: await getAllContentfulData({
      previewData
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
}

/* Export */

export { Preview }
