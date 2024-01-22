/**
 * Utils - Get All Data
 */

/* Imports */

import type { Generic } from '../../global/types/types'
import type { AllData } from '../../render/Render'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { config } from '../../config/config'
import { getFileData } from '../getFileData/getFileData'
import { undefineProps } from '../undefineProps/undefineProps'
import { resolveInternalLinks } from '../resolveInternalLinks/resolveInternalLinks'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isArray, isArrayStrict } from '../isArray/isArray'

/**
 * @typedef {object} AllFileDataArgs
 * @prop {object} [resolveProps]
 * @prop {string[]} resolveProps.image
 * @prop {string[]} resolveProps.data
 * @prop {object} [excludeProps]
 * @prop {string[]} excludeProps.data
 * @prop {object} excludeProps.archive
 * @prop {string[]} excludeProps.archive.posts
 * @prop {string[]} excludeProps.archive.terms
 * @prop {function} [filterData]
 * @prop {function} [filterAllData]
 */
interface AllFileDataArgs {
  resolveProps?: {
    image: string[]
    data: string[]
  }
  excludeProps?: {
    data: string[]
    archive: {
      posts: string[]
      terms: string[]
    }
  }
  filterData?: Function
  filterAllData?: Function
}

/**
 * Function - get data from file system
 *
 * @param {AllFileDataArgs} args
 * @return {Promise<AllData | undefined>}
 */
const getAllFileData = async (args: AllFileDataArgs): Promise<AllData | undefined> => {
  if (!isObjectStrict(args)) {
    return
  }

  const {
    resolveProps = {
      image: ['image'],
      data: ['items', 'internalLink', 'parent']
    },
    excludeProps = {
      data: ['content'],
      archive: {
        posts: ['content'],
        terms: ['content']
      }
    },
    filterData,
    filterAllData
  } = args

  try {
    /* Get data */

    let data = await getFileData('all_file_data', { all: true })

    /* Store all data */

    let allData: AllData = {
      navigation: [],
      navigationItem: [],
      redirect: [],
      content: {
        page: []
      }
    }

    config.contentTypes.partial.forEach((contentType) => {
      allData[contentType] = []
    })

    config.contentTypes.whole.forEach((contentType) => {
      allData.content[contentType] = []
    })

    /* Process data */

    if (Object.keys(data).length > 0) {
      /* Image data */

      let imageData = {}

      if (config.static.image.dataFile !== '') {
        const imageJson = await readFile(resolve(config.static.image.dataFile), { encoding: 'utf8' })

        if (imageJson !== null) {
          imageData = JSON.parse(imageJson)
        }
      }

      resolveInternalLinks(imageData, data, resolveProps.image)

      /* Id */

      Object.keys(data).forEach((d) => {
        const dataItem = data[d] as { contentType?: string, id?: string }

        if (isObjectStrict(dataItem)) {
          const { contentType } = dataItem

          if (contentType !== undefined) {
            dataItem.id = d
          }
        }
      })

      /* Internal props */

      resolveProps.data.forEach((d) => {
        resolveInternalLinks(data, data, [d], (prop: string, value: Generic) => {
          if (resolveProps.data.includes(prop)) {
            const newValue = undefineProps(value, excludeProps.data)

            return newValue
          }

          return value
        })
      })

      /* Filter data */

      if (typeof filterData === 'function') {
        data = filterData(data)
      }

      /* Empty archive data */

      config.archive.posts = {}
      config.archive.terms = {}

      /* Set content */

      Object.keys(data).forEach((d) => {
        const dataItem = data[d] as { contentType?: string }

        let contentType

        if (isObjectStrict(dataItem)) {
          const { contentType: dataItemContentType } = dataItem

          contentType = dataItemContentType
        }

        if (!isStringStrict(contentType)) {
          return
        }

        const partial = allData[contentType]

        if (isArray(partial)) {
          partial.push(dataItem)
        }

        const whole = allData.content[contentType]

        if (isArray(whole)) {
          whole.push(dataItem)
        }

        /* Archive */

        if (config.contentTypes.archive[contentType] !== undefined) {
          const dataItemCopy = undefineProps(dataItem, excludeProps.archive.posts)

          if (config.archive.posts[contentType] === undefined) {
            config.archive.posts[contentType] = []
          }

          const archivePosts = config.archive.posts[contentType]

          if (isArray(archivePosts)) {
            archivePosts.push(dataItemCopy)
          }
        }
      })

      /* Term content */

      Object.keys(config.contentTypes.taxonomy).forEach((tax) => {
        const { contentTypes, props } = config.contentTypes.taxonomy[tax]

        if (config.archive.terms[tax] === undefined) {
          config.archive.terms[tax] = {}
        }

        const archiveTax = config.archive.terms[tax] as Generic

        contentTypes.forEach((ct, i) => {
          const contentData = allData.content[ct] as Generic[]

          if (isArrayStrict(contentData)) {
            if (archiveTax[ct] === undefined) {
              archiveTax[ct] = {}
            }

            const archiveTaxContentType = archiveTax[ct] as Generic

            contentData.forEach((cd) => {
              const prop = props[i]
              const terms = cd[prop] as Array<{ id: string }>
              const dataCopy = undefineProps(cd, excludeProps.archive.terms)

              if (isArrayStrict(terms)) {
                terms.forEach((term) => {
                  const { id: termId } = term

                  if (archiveTaxContentType[termId] === undefined) {
                    archiveTaxContentType[termId] = []
                  }

                  const archiveTaxContentTypeTerm = archiveTaxContentType[termId]

                  if (isArray(archiveTaxContentTypeTerm)) {
                    archiveTaxContentTypeTerm.push(dataCopy)
                  }
                })
              }
            })
          }
        })
      })
    } else {
      throw new Error('No file data')
    }

    /* Filter all data */

    if (typeof filterAllData === 'function') {
      allData = filterAllData(allData)
    }

    /* Output */

    return allData
  } catch (error) {
    console.error(config.console.red, '[SSF] Error getting all file data: ', error)

    /* Output */

    return undefined
  }
}

/* Exports */

export { getAllFileData }
