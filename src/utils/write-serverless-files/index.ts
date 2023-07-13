/**
 * Utils - write serverless files
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import getPathDepth from '../get-path-depth'
import config from '../../config'

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
      await mkdir(resolve(config.serverless.dir), { recursive: true })
    }

    /* Ajax file */

    if (config.serverless.files.ajax !== '') {
      const content = `import ajax from '${formationPackage}ajax'; export const onRequestPost = [ajax];`
      const path = resolve(config.serverless.dir, config.serverless.files.ajax)
      const dir = dirname(path)

      await mkdir(resolve(config.serverless.dir, dir), { recursive: true })
      await writeFile(path, content)

      console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
    }

    /* Preview file */

    if (config.env.dev && config.serverless.files.preview !== '') {
      const content = `import config from '${getPathDepth(`${config.serverless.dir}/${config.serverless.files.preview}`)}src/config'; import preview from '${formationPackage}preview'; const render = async ({ request, next }) => { return await preview({ request, next, siteConfig: config }); }; export const onRequestGet = [render];`

      const path = resolve(config.serverless.dir, config.serverless.files.preview)
      const dir = dirname(path)

      await mkdir(resolve(config.serverless.dir, dir), { recursive: true })
      await writeFile(path, content)

      console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
    }

    /* Routes */

    const routes = Object.keys(config.serverless.routes)

    if (routes.length > 0) {
      const reloadFile = config.serverless.files.reload

      for (let i = 0; i < routes.length; i += 1) {
        const type = routes[i]
        const routesArr = config.serverless.routes[type]

        for (let r = 0; r < routesArr.length; r += 1) {
          let { path = '', content = '' } = routesArr[r]

          if (type === 'reload' && reloadFile !== '' && path !== '') {
            path = `${path}/${reloadFile}`

            content = `import config from '${getPathDepth(`${config.serverless.dir}/${path}`)}src/config'; import reload from '${formationPackage}reload'; const render = async ({ request, env, next }) => { return await reload({ request, env, next, siteConfig: config }); }; export const onRequestGet = [render];`
          }

          if (path !== '' && content !== '') {
            path = resolve(config.serverless.dir, path)

            const dir = dirname(path)

            await mkdir(resolve(config.serverless.dir, dir), { recursive: true })
            await writeFile(path, content)

            console.info(config.console.green, `[SSF] Successfully wrote ${path}`)
          }
        }
      }
    }
  } catch (error) {
    console.error(config.console.red, '[SSF] Error writing serverless files: ', error)
  }
}

/* Exports */

export default writeServerlessFiles
