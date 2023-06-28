/**
 * Utils - process images
 */

/* Imports */

import { config } from '../../config'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, dirname } from 'node:path'
import getAllFilePaths from '../get-all-file-paths'

/**
 * Function - get and save image data and output multiple sizes
 *
 * @param {function} sharp
 * @return {void}
 */

interface SharpImages {
  size: number
  path: string
  newPath: string
}

const processImages = async (sharp: any): Promise<void> => {
  const store = {}

  try {
    if (sharp === undefined) {
      throw new Error('Sharp module undefined')
    }

    const inputDir = config.static.image.inputDir
    const outputDir = config.static.image.outputDir
    const dataFile = config.static.image.dataFile

    if (inputDir === '' || outputDir === '') {
      throw new Error('No input or output directories')
    }

    const sharpImages: SharpImages[] = []

    for await (const path of getAllFilePaths(inputDir)) {
      if (!path.includes('.DS_Store')) {
        const ext = extname(path)
        const relPath: string = path.split(inputDir.split('./')[1])[1]
        const base: string = relPath.split(`${ext}`)[0]
        const folder = dirname(`${outputDir}${base}`)

        const metadata = await sharp(path).metadata()

        const { width = 0, height } = metadata

        store[base] = { base, width, height }

        let sizes = config.image.sizes

        sizes.push(width)

        sizes = sizes.filter(s => s <= width)

        await mkdir(folder, { recursive: true })

        sizes.forEach((size) => {
          sharpImages.push({
            size,
            path,
            newPath: `${outputDir}${base}${size !== width ? `@${size}` : ''}.webp`
          })
        })
      }
    }

    if (sharpImages.length > 0) {
      await Promise.all(
        sharpImages.map(async (c) => {
          const { size, path, newPath } = c

          const create = await sharp(`./${path}`)
            .webp({ quality: config.image.quality })
            .resize(size)
            .toFile(newPath)

          return create
        })
      )
    }

    if (dataFile !== '') {
      await writeFile(dataFile, JSON.stringify(store))
    }
  } catch (error) {
    console.error('Error processing images: ', error)
  }
}

/* Exports */

export default processImages
