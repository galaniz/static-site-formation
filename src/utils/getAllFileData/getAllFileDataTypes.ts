
/**
 * Utils - Get All Data Types
 */

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
export interface AllFileDataArgs {
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
