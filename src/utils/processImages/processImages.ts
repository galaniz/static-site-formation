/**
 * Utils - Process Images
 */

/* Imports */

import type { ImagesStore, ImagesSharp } from './processImagesTypes'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, resolve, basename, dirname } from 'node:path'
import { config } from '../../config/config'
import { getAllFilePaths } from '../getAllFilePaths/getAllFilePaths'
import { isStringStrict } from '../isString/isString'

/**
 * Function - get and save image data and output multiple sizes
 *
 * @return {Promise<PromiseSettledResult<sharp.OutputInfo>[]>}
 */
const processImages = async (): Promise<Array<PromiseSettledResult<sharp.OutputInfo>>> => {
  const store: ImagesStore = {}

  try {
    const inputDir = config.static.image.inputDir
    const outputDir = config.static.image.outputDir
    const dataFile = config.static.image.dataFile

    if (!isStringStrict(inputDir) || !isStringStrict(outputDir)) {
      throw new Error('No input or output directories')
    }

    await mkdir(resolve(outputDir), { recursive: true })

    const sharpImages: ImagesSharp[] = []

    for await (const path of getAllFilePaths(inputDir)) {
      if (!path.includes('.DS_Store')) {
        const ext = extname(path)
        const baseName = basename(path)
        const base: string = baseName.split(ext)[0]

        /* Nested files */

        let folders: string = dirname(path).split(`${inputDir}/`)[1]

        if (folders !== undefined && folders !== baseName) {
          await mkdir(resolve(outputDir, folders), { recursive: true })
        } else {
          folders = ''
        }

        /* Store meta data */

        const metadata = await sharp(path).metadata()
        const id = `${folders !== '' ? `${folders}/` : ''}${base}`
        const format = ext.split('.')[1]

        const {
          width = 0,
          height = 0,
          size: fileSize = 0,
          format: fileFormat = 'jpeg'
        } = metadata

        store[id] = {
          path: id,
          name: baseName,
          size: fileSize,
          type: `image/${fileFormat}`,
          format,
          width,
          height
        }

        /* Sizes */

        let sizes = [...config.image.sizes]

        sizes.push(width)

        sizes = sizes.filter(s => s <= width)

        sizes.forEach((size) => {
          sharpImages.push({
            size,
            ext: format,
            path: resolve(path),
            newPath: resolve(outputDir, folders, `${base}${size !== width ? `@${size}` : ''}`)
          })
        })
      }
    }

    if (sharpImages.length === 0) {
      throw new Error('No images to process')
    }

    if (isStringStrict(dataFile)) {
      await writeFile(resolve(dataFile), JSON.stringify(store))
    }

    return await Promise.allSettled(
      sharpImages.map(async (c) => {
        const { size, path, newPath, ext } = c

        await sharp(path)
          .resize(size)
          .toFile(`${newPath}.${ext}`)

        const create = await sharp(path)
          .webp({ quality: config.image.quality })
          .resize(size)
          .toFile(`${newPath}.webp`)

        return create
      })
    )
  } catch (error) {
    console.error(config.console.red, '[SSF] Error processing images: ', error)
  }

  return []
}

/* Exports */

export { processImages }
