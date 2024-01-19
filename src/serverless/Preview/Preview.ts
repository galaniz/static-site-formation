/**
 * Serverless - Preview
 */

/* Imports */

import { config, setConfig } from '../../config/config'
import { getAllContentfulData } from '../../utils/getAllContentfulData/getAllContentfulData'
import { Render } from '../../render/Render'

/**
 * Function - output preview from contentful
 *
 * @param {object} args
 * @param {object} args.request
 * @param {function} args.next
 * @param {object} args.siteConfig
 * @return {object} Response
 */

interface PreviewArgs {
  request: Request
  next: Function
  siteConfig: FRM.Config
}

const Preview = async ({ request, next, siteConfig }: PreviewArgs): Promise<Response> => {
  /* Params */

  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('content_type')
  const id = searchParams.get('preview')

  /* Preview id and content type required */

  if (id === null || typeof id !== 'string' || contentType === null || typeof contentType !== 'string') {
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

  if (!Array.isArray(data)) {
    html = data?.output !== undefined ? data.output : ''
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
