/**
 * Global - Types
 */

/**
 * @typedef {object} SlugBase
 * @prop {string} slug
 * @prop {string} title
 */
export interface SlugBase {
  slug: string
  title: string
}

/**
 * @typedef {object} InternalLinkBase
 * @prop {string} id
 * @prop {string} contentType
 * @prop {string} slug
 * @prop {string} [title]
 * @prop {string} [linkContentType]
 */
export interface InternalLinkBase {
  id: string
  contentType: string
  slug: string
  title?: string
  linkContentType?: string
}

/**
 * @typedef InternalLink
 * @type {InternalLinkBase}
 * @prop {*} [key] - Dynamic string key
 */
export interface InternalLink extends InternalLinkBase {
  [key: string]: unknown
}

/**
 * @typedef {object} ParentArgs
 * @prop {string} renderType
 * @prop {object} args
 */
export interface ParentArgs {
  renderType: string
  args: object
}

/**
 * @typedef {Object.<string, *>} Generic
 */
export interface Generic {
  [key: string]: unknown
}
