/**
 * Utils - Get Prop Types
 */

/* Imports */

import type { ImagesProps } from '../processImages/processImagesTypes'

/**
 * @typedef {object} PropId
 * @prop {string} [id]
 * @prop {object} [sys]
 * @prop {string} [sys.id]
 */
export interface PropId {
  id?: string
  sys?: {
    id?: string
  }
}

/**
 * @typedef {function} PropIdMethod
 * @param {PropId} [obj]
 * @return {string}
 */
type PropIdMethod = (obj?: PropId) => string

/**
 * @typedef {object} PropType
 * @prop {string} [renderType]
 * @prop {string} [contentType]
 * @prop {object} [sys]
 * @prop {string} [sys.type]
 * @prop {object} [sys.contentType]
 * @prop {object} [sys.contentType.sys]
 * @prop {string} [sys.contentType.sys.id]
 */
export interface PropType {
  renderType?: string
  contentType?: string
  sys?: {
    type?: string
    contentType?: {
      sys?: {
        id?: string
      }
    }
  }
}

/**
 * @typedef {function} PropTypeMethod
 * @prop {PropType} [obj]
 * @prop {string} [subtype]
 * @return {string}
 */
type PropTypeMethod = (obj?: PropType, subtype?: string) => string

/**
 * @typedef {function} PropSelfMethod
 * @prop {object} obj
 * @return {object}
 */
type PropSelfMethod = <T>(obj: T) => T

/**
 * @typedef {function} PropFieldsMethod
 * @prop {object} obj
 * @prop {string} prop
 * @return {*|undefined}
 */
type PropFieldsMethod = <T, P extends keyof T>(obj: T, prop: P) => T[P] | undefined

/**
 * @typedef PropFile
 * @type {import('../processImages/processImagesTypes').ImagesProps}
 * @prop {import('../global/globalTypes').Generic} [fields]
 * @prop {object} [fields.file]
 * @prop {string} [fields.file.url]
 * @prop {string} [fields.file.contentType]
 * @prop {string} [fields.file.fileName]
 * @prop {object} [fields.file.details]
 * @prop {object} [fields.file.details.image]
 * @prop {number} [fields.file.details.image.width]
 * @prop {number} [fields.file.details.image.height]
 * @prop {number} [fields.file.details.size]
 * @prop {string} [fields.description]
 */
export interface PropFile extends Partial<ImagesProps> {
  fields?: {
    file?: {
      url?: string
      contentType?: string
      fileName?: string
      details?: {
        image?: {
          width?: number
          height?: number
        }
        size?: number
      }
    }
    description?: string
    [key: string]: unknown
  }
}

/**
 * @typedef {function} PropsFileMethod
 * @prop {PropFile} [obj]
 * @prop {string} [prop]
 * @prop {string} [source]
 * @return {PropFileReturn|string|undefined}
 */
type PropsFileMethod = (obj?: PropFile, prop?: string, source?: string) => PropFileReturn | string | undefined

/**
 * @typedef {object} PropFileReturn
 * @prop {string} url
 * @prop {string} path
 * @prop {string} name
 * @prop {string} type
 * @prop {string} format
 * @prop {string} alt
 * @prop {number} naturalWidth
 * @prop {number} naturalHeight
 * @prop {number} size
 */
export interface PropFileReturn {
  url: string
  path: string
  name: string
  type: string
  format: string
  alt: string
  naturalWidth: number
  naturalHeight: number
  size: number
}

/**
 * @typedef {object} PropTag
 * @prop {string} [id]
 * @prop {string} [name]
 * @prop {import('../global/globalTypes').Generic} [sys]
 * @prop {string} [sys.id]
 */
export interface PropTag {
  id?: string
  name?: string
  sys?: {
    id?: string
    [key: string]: unknown
  }
}

/**
 * @typedef {object} PropTags
 * @prop {object} [metadata]
 * @prop {PropTag[]} [tags]
 */
export interface PropTags {
  metadata?: {
    tags?: PropTag[]
  }
}

/**
 * @typedef {object} PropTagReturn
 * @prop {string} id
 * @prop {string} name
 */
export interface PropTagReturn {
  id: string
  name: string
}

/**
 * @typedef {function} PropsTagMethod
 * @prop {PropTags} obj
 * @prop {string} id
 * @return {PropTagReturn|undefined}
 */
type PropsTagMethod = (obj: PropTags, id: string) => PropTagReturn | undefined

/**
 * @typedef {object} Prop
 * @prop {PropIdMethod} id
 * @prop {PropTypeMethod} type
 * @prop {PropSelfMethod} self
 * @prop {PropFieldsMethod} fields
 * @prop {PropsFileMethod} file
 * @prop {PropsTagMethod} tag
 */
export interface Prop {
  id: PropIdMethod
  type: PropTypeMethod
  self: PropSelfMethod
  fields: PropFieldsMethod
  file: PropsFileMethod
  tag: PropsTagMethod
}
