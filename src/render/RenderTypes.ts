/**
 * Render - Types
 */

/* Imports */

import type { Generic, InternalLink, ParentArgs } from '../global/globalTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'

/**
 * @typedef {object} RenderSlug
 * @prop {string} contentType
 * @prop {string} id
 */
export interface RenderSlug {
  contentType: string
  id: string
}

/**
 * @typedef {Object.<string, RenderSlug>} RenderSlugs
 */
export interface RenderSlugs {
  [key: string]: RenderSlug
}

/**
 * @typedef RenderMetaArgs
 * @type {Generic}
 * @prop {RenderMetaReturn} [meta]
 * @prop {string} [metaTitle]
 * @prop {string} [metaDescription]
 * @prop {object} [metaImage]
 * @prop {object} [metaImage.fields]
 * @prop {object} [metaImage.fields.file]
 * @prop {string} [metaImage.fields.file.url]
 */
export interface RenderMetaArgs extends Generic {
  meta?: RenderMetaReturn
  metaTitle?: string
  metaDescription?: string
  metaImage?: {
    fields?: {
      file?: {
        url?: string
      }
    }
  }
}

/**
 * @typedef {object} RenderMetaReturn
 * @prop {string} [title]
 * @prop {string} [paginationTitle]
 * @prop {string} [description]
 * @prop {string} [url]
 * @prop {string} [image]
 * @prop {string} [canonical]
 * @prop {string} [prev]
 * @prop {string} [next]
 * @prop {boolean} [noIndex]
 * @prop {boolean} [isIndex]
 */
export interface RenderMetaReturn {
  title?: string
  paginationTitle?: string
  description?: string
  url?: string
  image?: string
  canonical?: string
  prev?: string
  next?: string
  noIndex?: boolean
  isIndex?: boolean
}

/**
 * @typedef {object} RenderContentArgs
 * @prop {Generic[]} contentData
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {object} output
 * @prop {string} output.html
 * @prop {ParentArgs[]} parents
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {Object.<string, string>} navigations
 * @prop {RenderFunctions} renderFunctions
 */
export interface RenderContentArgs {
  contentData: Generic[]
  serverlessData?: RenderServerlessData
  output: {
    html: string
  }
  parents: ParentArgs[]
  pageData: RenderItem
  pageContains: string[]
  navigations: {
    [key: string]: string
  }
  renderFunctions: RenderFunctions
}

/**
 * @typedef {Object.<string, function>} RenderFunctions
 */
export interface RenderFunctions {
  [key: string]: Function
}

/**
 * @typedef {object} RenderServerlessData
 * @prop {string} path
 * @prop {Generic} query
 */
export interface RenderServerlessData {
  path: string
  query: Generic
}

/**
 * @typedef {object} RenderPreviewData
 * @prop {string} id
 * @prop {string} contentType
 */
export interface RenderPreviewData {
  id: string
  contentType: string
}

/**
 * @typedef RenderRichTextDataTargetProp
 * @type {InternalLink}
 * @prop {object} [fields]
 * @prop {object} [fields.file]
 * @prop {string} [fields.file.url]
 */
export interface RenderRichTextDataTargetProp extends InternalLink {
  fields?: {
    file?: {
      url?: string
    }
    [key: string]: unknown
  }
}

/**
 * @typedef {object} RenderRichTextData
 * @prop {object} [data]
 * @prop {RenderRichTextDataTargetProp} [data.target]
 */
export interface RenderRichTextData {
  data?: {
    target?: RenderRichTextDataTargetProp
  }
}

/**
 * @typedef RenderItem
 * @type {Generic}
 * @prop {string} [id]
 * @prop {string} [title]
 * @prop {string} [slug]
 * @prop {Generic|Generic[]} [content]
 * @prop {Generic} [meta]
 * @prop {string} [basePermalink]
 * @prop {string} [linkContentType]
 */
export interface RenderItem extends Generic {
  id?: string
  title?: string
  slug?: string
  content?: Generic | Generic[]
  meta?: Generic
  basePermalink?: string
  linkContentType?: string
}

/**
 * @typedef {object} RenderItemArgs
 * @prop {RenderItem} item
 * @prop {string} contentType
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderFunctions} renderFunctions
 */
export interface RenderItemArgs {
  item: RenderItem
  contentType: string
  serverlessData?: RenderServerlessData
  renderFunctions: RenderFunctions
}

/**
 * @typedef {object} RenderItemReturn
 * @prop {boolean} [serverlessRender]
 * @prop {RenderItem} [pageData]
 * @prop {object} [data]
 * @prop {string} data.slug
 * @prop {string} data.output
 */
export interface RenderItemReturn {
  serverlessRender?: boolean
  pageData?: RenderItem
  data?: {
    slug: string
    output: string
  }
}

/**
 * @typedef {object} RenderItemStartActionArgs
 * @prop {string} id
 * @prop {string} contentType
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderItemStartActionArgs {
  id: string
  contentType: string
  pageData: RenderItem
  pageContains: string[]
  serverlessData?: RenderServerlessData
}

/**
 * @typedef {object} RenderItemActionArgs
 * @prop {string} id
 * @prop {string} contentType
 * @prop {string} slug
 * @prop {string} output
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderItemActionArgs {
  id: string
  contentType: string
  slug: string
  output: string
  pageData: RenderItem
  pageContains: string[]
  serverlessData?: RenderServerlessData
}

/**
 * @typedef {object} RenderLayoutArgs
 * @prop {string} id
 * @prop {RenderMetaReturn} meta
 * @prop {Object.<string, string>} [navigations]
 * @prop {string} contentType
 * @prop {string} content
 * @prop {string} slug
 * @prop {string[]} pageContains
 * @prop {RenderItem} pageData
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderLayoutArgs {
  id: string
  meta: RenderMetaReturn
  navigations?: {
    [key: string]: string
  }
  contentType: string
  content: string
  slug: string
  pageContains: string[]
  pageData: RenderItem
  serverlessData?: RenderServerlessData | undefined
}

/**
 * @typedef RenderAllData
 * @type {Generic}
 * @prop {Navigation[]} navigation
 * @prop {NavigationItem[]} navigationItem
 * @prop {object} content
 * @prop {Generic[]} content.page
 * @prop {Generic[]} redirect
 */
export interface RenderAllData extends Generic {
  navigation: Navigation[]
  navigationItem: NavigationItem[]
  content: {
    page: Generic[]
    [key: string]: Generic[]
  }
  redirect: Generic[]
}

/**
 * @typedef {object} RenderArgs
 * @prop {RenderAllData} [allData]
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 */
export interface RenderArgs {
  allData?: RenderAllData
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
}

/**
 * @typedef {object} RenderReturn
 * @prop {string} slug
 * @prop {string} output
 */
export interface RenderReturn {
  slug: string
  output: string
}
