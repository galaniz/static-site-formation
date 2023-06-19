/**
 * Serverless - preview
 */

/* Imports */

import render from '../render'
import getContentfulDataServerless from '../utils/get-contentful-data-serverless'

/**
 * Function - output preview from contentful
 *
 * @private
 * @param {object} context
 * @return {object}
 */

const preview = async ({ request, next, env }) => {
  /* Params */

  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('content_type')
  const id = searchParams.get('preview')

  /* Preview id and content type required */

  if (!id && !contentType) {
    return next()
  }

  /* Output */

  const data = await render({
    previewData: {
      id,
      contentType
    },
    getContentfulData: getContentfulDataServerless,
    env: {
      dev: true,
      prod: false,
      ctfl: {
        spaceId: env.CTFL_SPACE_ID,
        cpaToken: env.CTFL_CPA_TOKEN,
        cdaToken: env.CTFL_CDA_TOKEN
      }
    }
  })

  const html = data?.output ? data.output : ''

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  })
}

/* Export */

export default preview
