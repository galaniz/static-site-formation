/**
 * Utils - process images
 */

/* Imports */

import { mkdir, writeFile } from 'node:fs/promises'
import { extname, resolve, basename, dirname } from 'node:path'
import sharp from 'sharp'
import config from '../../config'
import getAllFilePaths from '../get-all-file-paths'

/**
 * Function - get and save image data and output multiple sizes
 *
 * @return {void}
 */

interface ProcessImagesSharp {
  size: number
  path: string
  newPath: string
}

interface ProcessImagesStore {
  [key: string]: {
    base: string
    width: number
    height: number
  }
}

const processImages = async (): Promise<void> => {
  const store: ProcessImagesStore = {}

  try {
    const inputDir = config.static.image.inputDir
    const outputDir = config.static.image.outputDir
    const dataFile = config.static.image.dataFile

    if (inputDir === '' || outputDir === '') {
      throw new Error('No input or output directories')
    }

    await mkdir(resolve(outputDir), { recursive: true })

    const sharpImages: ProcessImagesSharp[] = []

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

        const { width = 0, height = 0 } = metadata

        store[id] = { base: id, width, height }

        /* Sizes */

        let sizes = [...config.image.sizes]

        sizes.push(width)

        sizes = sizes.filter(s => s <= width)

        sizes.forEach((size) => {
          sharpImages.push({
            size,
            path: resolve(path),
            newPath: resolve(outputDir, folders, `${base}${size !== width ? `@${size}` : ''}.webp`)
          })
        })
      }
    }

    if (sharpImages.length > 0) {
      await Promise.all(
        sharpImages.map(async (c) => {
          const { size, path, newPath } = c

          const create = await sharp(path)
            .webp({ quality: config.image.quality })
            .resize(size)
            .toFile(newPath)

          return create
        })
      )
    }

    if (dataFile !== '') {
      await writeFile(resolve(dataFile), JSON.stringify(store))
    }
  } catch (error) {
    console.error(config.console.red, '[SSF] Error processing images: ', error)
  }
}

/* Exports */

export default processImages
