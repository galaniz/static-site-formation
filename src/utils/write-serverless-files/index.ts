/**
 * Utils - write serverless files
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { config } from '../../config'

/**
 * Function - write files from serverless
 *
 * @return {void}
 */

const writeServerlessFiles = async (): Promise<void> => {
  try {
    const formationPackage = '@alanizcreative/static-site-formation/src/serverless/'

    /* Serverless folder */

    if (config.serverless.dir !== '') {
      await mkdir(config.serverless.dir, { recursive: true })
    }

    /* Ajax file */

    if (config.serverless.files.ajax !== '') {
      const content = `import ajax from '${formationPackage}ajax'; export const onRequestPost = [ajax];`
      const path = `${config.serverless.dir}${config.serverless.files.ajax}`

      await writeFile(path, content)

      console.log(`Successfully wrote ${path}`)
    }

    /* Preview file */

    if (config.env.dev && config.serverless.files.preview !== '') {
      const content = `import { config } from '../src/config'; import preview from '${formationPackage}preview'; const render = async ({ request, next }) => { return await preview({ request, next, siteConfig: config }); }; export const onRequestGet = [render];`

      const path = `${config.serverless.dir}${config.serverless.files.preview}`

      await writeFile(path, content)

      console.log(`Successfully wrote ${path}`)
    }

    /* Routes */

    const routes = Object.keys(config.serverless.routes)

    if (routes.length > 0) {
      const reloadFile = config.serverless.files.reload

      for (let i = 0; i < routes.length; i += 1) {
        const type = routes[i]
        const obj: Formation.ServerlessRoute = config.serverless.routes[type[i]]

        let { path = '', content = '' } = obj

        if (type === 'reload' && reloadFile !== '' && path !== '') {
          path = `${config.serverless.dir}${path}${reloadFile}`
          content = `import { config } from '../src/config'; import reload from '${formationPackage}preview'; const render = async ({ request, env, next }) => { return await reload({ request, env, next, siteConfig: config }); }; export const onRequestGet = [render];`
        }

        if (path !== '' && content !== '') {
          await writeFile(path, content)

          console.log(`Successfully wrote ${path}`)
        }
      }
    }
  } catch (error) {
    console.error('Error writing serverless files: ', error)
  }
}

/* Exports */

export default writeServerlessFiles
