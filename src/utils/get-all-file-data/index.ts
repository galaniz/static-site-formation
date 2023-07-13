/**
 * Utils - get all data
 */

/* Imports */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import config from '../../config'
import getFileData from '../get-file-data'
import undefineProps from '../undefine-props'
import resolveInternalLinks from '../resolve-internal-links'

/**
 * Function - get data from file system/cache if available
 *
 * @param {object} args
 * @param {object} args.resolveProps
 * @param {object} args.excludeProps
 * @param {function} args.filterData
 * @param {function} args.filterAllData
 * @param {boolean} args.cache
 * @return {object|undefined}
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
  cache?: boolean
}

const getAllFileData = async (args: AllFileDataArgs): Promise<FRM.AllData | undefined> => {
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
    filterAllData,
    cache = false
  } = args

  try {
    /* Get data */

    let data = await getFileData('all_file_data', { all: true }, cache)

    /* Store all data */

    let allData: FRM.AllData = {
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
        const dd = data[d]
        const { contentType } = dd

        if (contentType !== undefined && d !== undefined) {
          dd.id = d
        }
      })

      /* Internal props */

      resolveProps.data.forEach((d) => {
        resolveInternalLinks(data, data, [d], (prop: string, value: any) => {
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
        const dd = data[d]
        const { contentType } = dd

        if (allData[contentType] !== undefined) {
          allData[contentType].push(dd)
        }

        if (allData.content[contentType] !== undefined) {
          allData.content[contentType].push(dd)
        }

        /* Archive */

        if (config.contentTypes.archive.includes(contentType)) {
          const ddCopy = undefineProps(dd, excludeProps.archive.posts)

          if (config.archive.posts[contentType] === undefined) {
            config.archive.posts[contentType] = []
          }

          config.archive.posts[contentType].push(ddCopy)
        }
      })

      /* Term content */

      Object.keys(config.taxonomy).forEach((tax) => {
        const { contentTypes, props } = config.taxonomy[tax]

        if (config.archive.terms?.[tax] === undefined) {
          config.archive.terms[tax] = {}
        }

        contentTypes.forEach((c, i) => {
          const contentData = allData.content[c]

          if (contentData !== undefined) {
            if (config.archive.terms[tax]?.[c] === undefined) {
              config.archive.terms[tax][c] = {}
            }

            contentData.forEach((d) => {
              const prop = props[i]
              const terms = d[prop]
              const dCopy = undefineProps(d, excludeProps.archive.terms)

              if (terms !== undefined) {
                terms.forEach((term: any) => {
                  if (config.archive.terms[tax][c]?.[term.id] === undefined) {
                    config.archive.terms[tax][c][term.id] = []
                  }

                  config.archive.terms[tax][c][term.id].push(dCopy)
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

export default getAllFileData
