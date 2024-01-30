/**
 * Utils - Get All Data
 */

/* Imports */

import type { AllFileDataArgs } from './getAllFileDataTypes'
import type { Generic } from '../../global/globalTypes'
import type { RenderAllData } from '../../render/RenderTypes'
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
 * Function - get data from file system
 *
 * @param {AllFileDataArgs} args
 * @return {Promise<RenderAllData|undefined>}
 */
const getAllFileData = async (args: AllFileDataArgs): Promise<RenderAllData | undefined> => {
  args = isObjectStrict(args) ? args : {}

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

    let allData: RenderAllData = {
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

    /* Data must be non empty object */

    if (!isObjectStrict(data) || Object.keys(data).length === 0) {
      throw new Error('No file data')
    }

    /* Image data */

    let imageData = {}

    if (config.static.image.dataFile !== '') {
      const imageJson = await readFile(resolve(config.static.image.dataFile), { encoding: 'utf8' })

      if (isStringStrict(imageJson)) {
        imageData = JSON.parse(imageJson)
      }
    }

    resolveInternalLinks(imageData, data, resolveProps.image)

    /* Id */

    Object.keys(data).forEach((d) => {
      const dataItem = data[d]

      if (isObjectStrict(dataItem)) {
        const { contentType } = dataItem

        if (isStringStrict(contentType)) {
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
      const dataItem = data[d]

      if (!isObjectStrict(dataItem)) {
        return
      }

      const { contentType } = dataItem

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

        config.archive.posts[contentType].push(dataItemCopy)
      }
    })

    /* Term content */

    Object.keys(config.contentTypes.taxonomy).forEach((tax) => {
      const { contentTypes, props } = config.contentTypes.taxonomy[tax]

      if (config.archive.terms[tax] === undefined) {
        config.archive.terms[tax] = {}
      }

      contentTypes.forEach((ct, i) => {
        const contentData = allData.content[ct]

        if (isArrayStrict(contentData)) {
          if (config.archive.terms[tax][ct] === undefined) {
            config.archive.terms[tax][ct] = {}
          }

          contentData.forEach((cd) => {
            const prop = props[i]
            const terms = cd[prop] as Generic[]
            const dataCopy = undefineProps(cd, excludeProps.archive.terms)

            if (isArrayStrict(terms)) {
              terms.forEach((term) => {
                if (!isObjectStrict(term)) {
                  return
                }

                const termId = term.id

                if (!isStringStrict(termId)) {
                  return
                }

                if (config.archive.terms[tax][ct][termId] === undefined) {
                  config.archive.terms[tax][ct][termId] = []
                }

                const archiveTaxContentTypeTerm = config.archive.terms[tax][ct][termId]

                if (isArray(archiveTaxContentTypeTerm)) {
                  archiveTaxContentTypeTerm.push(dataCopy)
                }
              })
            }
          })
        }
      })
    })

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
