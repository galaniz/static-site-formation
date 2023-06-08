/**
 * Utils - process images
 */

/* Imports */

import { config } from '../../config'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, dirname } from 'node:path'
import { existsSync } from 'node:fs'
import getAllFilePaths from '../get-all-file-paths'

/**
 * Function - get and save image data and output multiple sizes
 *
 * @param {string} inputDir
 * @param {string} outputDir
 * @param {string} savePath
 * @param {function} sharp
 * @return {void}
 */

interface CreateArgs {
  size: number
  width: number
  path: string
  name: string
}

const processImages = async (
  inputDir: string = '',
  outputDir: string = '',
  savePath: string = '',
  sharp: any
): Promise<void> => {
  const store = {}

  const create = async ({ size, width, path, name }: CreateArgs): Promise<object> => {
    const newPath = `./${outputDir}/${name}${size !== width ? `@${size}` : ''}.webp`

    return await sharp(`./${path}`)
      .webp({ quality: 75 })
      .resize(size)
      .toFile(newPath)
  }

  try {
    if (sharp === undefined) {
      throw new Error('Sharp module undefined')
    }

    if (inputDir === '' || outputDir === '') {
      throw new Error('No input or output directories')
    }

    for await (const path of getAllFilePaths(`./${inputDir}`)) {
      if (typeof path === 'string' && path.includes('.DS_Store')) {
        continue
      }

      const ext = extname(path)
      const relPath: string = path.split(`${inputDir}/`)[1]
      const base: string = relPath.split(`${ext}`)[0]
      const folder = dirname(`./${outputDir}/${base}`)

      const metadata = await sharp(path).metadata()
      const { width = 0, height } = metadata

      store[base] = { base, width, height }

      let sizes = config.imageSizes

      sizes.push(width)

      sizes = sizes.filter(s => s <= width)

      if (!existsSync(folder)) {
        await mkdir(folder, { recursive: true })
      }

      await Promise.all(
        sizes.map(async (size) => {
          return await create({ size, width, path, name: base })
        })
      )
    }

    if (savePath !== '') {
      await writeFile(`./${savePath}`, JSON.stringify(store))
    }
  } catch (error) {
    console.error('Error processing images: ', error)
  }
}

/* Exports */

export default processImages
