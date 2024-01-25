/**
 * Utils - Get Slug Types
 */

/* Imports */

import type { SlugParent } from '../../global/globalTypes'

/**
 * @typedef {object} SlugArgs
 * @prop {string} [id]
 * @prop {string} slug
 * @prop {number} [page]
 * @prop {string} contentType
 * @prop {string} [linkContentType]
 * @prop {boolean} [returnParents]
 */
export interface SlugArgs {
  id?: string
  slug: string
  page?: number
  contentType: string
  linkContentType?: string
  returnParents?: boolean
}

/**
 * @typedef {object} SlugReturn
 * @prop {string} slug
 * @prop {SlugParent[]} parents
 */
export interface SlugReturn {
  slug: string
  parents: SlugParent[]
}
