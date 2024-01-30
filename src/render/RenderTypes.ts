/**
 * Render - Types
 */

/* Imports */

import type { Generic, GenericFunctions, GenericStrings, ParentArgs, HtmlString } from '../global/globalTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'
import type { RichTextContentItem } from '../text/RichText/RichTextTypes'
import { PropFile, PropId, PropType } from '../utils/getProp/getPropTypes'

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
 * @prop {Generic} [metaImage]
 */
export interface RenderMetaArgs extends Generic {
  meta?: RenderMetaReturn
  metaTitle?: string
  metaDescription?: string
  metaImage?: Generic
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
 * @typedef {} RenderContentData
 */
export type RenderContentData =
  Generic &
  PropId &
  PropFile &
  PropType &
  Omit<RichTextContentItem, 'content'> &
  {
    content?: RenderContentData | RenderContentData[]
    templates?: RenderContentData[]
  }

/**
 * @typedef {object} RenderContentArgs
 * @prop {RenderContentData[]} contentData
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {HtmlString} output
 * @prop {ParentArgs[]} parents
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {GenericStrings} navigations
 * @prop {GenericFunctions} renderFunctions
 */
export interface RenderContentArgs {
  contentData: RenderContentData[]
  serverlessData?: RenderServerlessData
  output: HtmlString
  parents: ParentArgs[]
  pageData: RenderItem
  pageContains: string[]
  navigations: GenericStrings
  renderFunctions: GenericFunctions
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
 * @typedef {object} RenderRedirect
 * @prop {object} [key] - Dynamic key
 * @prop {string[]} key.redirect
 */
export interface RenderRedirect {
  [key: string]: {
    redirect: string[]
  }
}

/**
 * @typedef RenderItem
 * @type {Generic}
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} [title]
 * @prop {RenderContentData|RenderContentData[]} [content]
 * @prop {RenderMetaReturn} [meta]
 * @prop {string} [basePermalink]
 * @prop {string} [linkContentType]
 */
export interface RenderItem extends Generic {
  id: string
  slug: string
  title?: string
  content?: RenderContentData | RenderContentData[]
  meta?: RenderMetaReturn
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
  renderFunctions: GenericFunctions
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
 * @prop {GenericStrings} [navigations]
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
  navigations?: GenericStrings
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
 * @prop {RenderItem[]} content.page
 * @prop {RenderRedirect[]} redirect
 */
export interface RenderAllData extends Generic {
  navigation: Navigation[]
  navigationItem: NavigationItem[]
  content: {
    page: RenderItem[]
    [key: string]: RenderItem[]
  }
  redirect: RenderRedirect[]
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

export type RenderContentFilter = (content: string, args: ParentArgs) => Promise<string>

export type RenderItemFilter = (output: string, args: RenderItemActionArgs) => Promise<string>

export type RenderNameFilter = (name: string) => Promise<string>
