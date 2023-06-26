/**
 * Serverless - preview
 */

/* Imports */

import { config, setConfig } from '../../config'
import getAllContentfulData from '../../utils/get-all-contentful-data'
import render from '../../render'

/**
 * Function - output preview from contentful
 *
 * @param {object} args
 * @param {object} args.request
 * @param {function} args.next
 * @param {object} args.siteConfig
 * @return {object}
 */

interface PreviewArgs {
  request: any
  next: Function
  siteConfig: Formation.Config
}

const preview = async ({ request, next, siteConfig }: PreviewArgs): Promise<object> => {
  /* Params */

  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('content_type')
  const id = searchParams.get('preview')

  /* Preview id and content type required */

  if (id === null || typeof id !== 'string' || contentType === null || typeof contentType !== 'string') {
    return next()
  }

  /* Config */

  setConfig(siteConfig)

  config.env.dev = true
  config.env.prod = false

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

  if (!Array.isArray(data)) {
    html = data?.output !== undefined ? data.output : ''
  }

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  })
}

/* Export */

export default preview
