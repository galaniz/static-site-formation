/**
 * Utils - Get Contentful Data Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes'
import type { RenderItem } from '../../render/renderTypes'

/**
 * @typedef {Object.<string, (string|number|boolean)>} ContentfulDataParams
 */
export interface ContentfulDataParams {
  [key: string]: string | number | boolean
}

/**
 * @typedef {object} ContentfulDataTag
 * @prop {object} [sys]
 * @prop {string} [sys.id]
 * @prop {string} [sys.name]
 */
export interface ContentfulDataTag {
  sys?: {
    id?: string
    name?: string
  }
}

/**
 * @typedef {object} ContentfulDataMark
 * @prop {string} type
 */
export interface ContentfulDataMark {
  type: string
}

/**
 * @typedef {object} ContentfulDataFile
 * @prop {string} [url]
 * @prop {string} [contentType]
 * @prop {string} [fileName]
 * @prop {object} [details]
 * @prop {number} [details.size]
 * @prop {object} [details.image]
 * @prop {number} [details.image.width]
 * @prop {number} [details.image.height]
 */
export interface ContentfulDataFile {
  url?: string
  contentType?: string
  fileName?: string
  details?: {
    size?: number
    image?: {
      width?: number
      height?: number
    }
  }
}

/**
 * @typedef ContentfulDataFields
 * @type {import('../../global/globalTypes').Generic}
 * @prop {ContentfulDataItem[]|ContentfulDataItem} [content]
 * @prop {ContentfulDataFile} [file]
 * @prop {ContentfulDataItem} [internalLink]
 * @prop {string} [description]
 * @prop {string} [title]
 */
export interface ContentfulDataFields extends Generic {
  content?: ContentfulDataItem[] | ContentfulDataItem
  internalLink?: ContentfulDataItem
  file?: ContentfulDataFile
  description?: string
  title?: string
}

/**
 * @typedef {object} ContentfulDataSys
 * @prop {string} [id]
 * @prop {string} [type]
 * @prop {object} [contentType]
 * @prop {object} [contentType.sys]
 * @prop {string} [contentType.sys.id]
 */
export interface ContentfulDataSys {
  id?: string
  type?: string
  contentType?: {
    sys?: {
      id?: string
    }
  }
}

/**
 * @typedef {object} ContentfulDataItem
 * @prop {string} [value]
 * @prop {string} [nodeType]
 * @prop {ContentfulDataMark[]} [marks]
 * @prop {object} [data]
 * @prop {string} [data.uri]
 * @prop {ContentfulDataItem} [data.target]
 * @prop {ContentfulDataItem[]|string} [content]
 * @prop {object} [metadata]
 * @prop {ContentfulDataTag[]} [metadata.tags]
 * @prop {ContentfulDataSys} [sys]
 * @prop {ContentfulDataFields} [fields]
 */
export interface ContentfulDataItem {
  value?: string
  nodeType?: string
  marks?: ContentfulDataMark[]
  data?: {
    uri?: string
    target?: ContentfulDataItem
  }
  content?: ContentfulDataItem[] | string
  metadata?: {
    tags?: ContentfulDataTag[]
  }
  sys?: ContentfulDataSys
  fields?: ContentfulDataFields
}

/**
 * @typedef ContentfulData
 * @type {import('../../global/globalTypes').Generic}
 * @prop {ContentfulDataItem[]} [items]
 * @prop {import('../../global/globalTypes').Generic[]} [errors]
 */
export interface ContentfulData extends Generic {
  items?: ContentfulDataItem[]
  errors?: Generic[]
}

/**
 * @typedef ContentfulDataReturn
 * @type {import('../../global/globalTypes').Generic}
 * @prop {import('../../render/RenderTypes').RenderItem[]} [items]
 * @prop {import('../../global/globalTypes').Generic[]} [errors]
 */
export interface ContentfulDataReturn extends Generic {
  items?: RenderItem[]
  errors?: Generic[]
}
