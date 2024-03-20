/**
 * Render - Types
 */

/* Imports */

import type { Generic, GenericFunctions, GenericStrings, ParentArgs, HtmlString } from '../global/globalTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'
import type { RichTextContentItem, RichTextHeading } from '../text/RichText/RichTextTypes'
import type { PropFile, PropId, PropType, PropTags } from '../utils/getProp/getPropTypes'

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
 * @type {import('../global/globalTypes').Generic}
 * @prop {RenderMetaReturn} [meta]
 * @prop {string} [metaTitle]
 * @prop {string} [metaDescription]
 * @prop {import('../global/globalTypes').Generic} [metaImage]
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
 * @typedef {object} RenderCommon
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {Array.<import('../text/RichText/RichTextTypes').RichTextHeading[]>} pageHeadings
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderCommon {
  pageData: RenderItem
  pageHeadings: RichTextHeading[][]
  pageContains: string[]
  serverlessData?: RenderServerlessData | undefined
}

/**
 * @typedef RenderContentData
 * @type {
 * import('../global/globalTypes').Generic|
 * import('../utils/getProp/getPropTypes').PropId|
 * import('../utils/getProp/getPropTypes').PropFile|
 * import('../utils/getProp/getPropTypes').PropType|
 * import('../utils/getProp/getPropTypes').PropTags|
 * import('../text/RichText/RichTextTypes').RichTextContentItem
 * }
 * @prop {RenderContentData|RenderContentData[]} [content]
 * @prop {RenderContentData[]} [templates]
 */
export type RenderContentData =
  Generic &
  PropId &
  PropFile &
  PropType &
  PropTags &
  Omit<RichTextContentItem, 'content'> &
  {
    content?: RenderContentData | RenderContentData[]
    repeat?: RenderContentData
    templates?: RenderContentData[]
  }

/**
 * @typedef {RenderContentData|RenderContentData[]} RenderTemplateData
 */
export type RenderTemplateData = RenderContentData | RenderContentData[]

/**
 * @typedef RenderContentArgs
 * @type {RenderCommon}
 * @prop {RenderContentData[]} contentData
 * @prop {import('../global/globalTypes').HtmlString} output
 * @prop {import('../global/globalTypes').ParentArgs[]} parents
 * @prop {import('../global/globalTypes').GenericStrings} navigations
 * @prop {import('../global/globalTypes').GenericFunctions} renderFunctions
 * @prop {number} [headingsIndex]
 * @prop {number} [depth]
 */
export interface RenderContentArgs extends RenderCommon {
  contentData: RenderContentData[]
  output: HtmlString
  parents: ParentArgs[]
  navigations: GenericStrings
  renderFunctions: GenericFunctions
  headingsIndex?: number
  depth?: number
}

/**
 * @typedef {object} RenderServerlessData
 * @prop {string} path
 * @prop {import('../global/globalTypes').Generic} query
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
 * @typedef {object} RenderRedirectItem
 * @prop {string[]} redirect
 */
export interface RenderRedirectItem {
  redirect: string[]
}

/**
 * @typedef {Object.<string, RenderRedirectItem>} RenderRedirect
 */
export interface RenderRedirect {
  [key: string]: RenderRedirectItem
}

/**
 * @typedef RenderItem
 * @type {import('../global/globalTypes').Generic}
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
 * @typedef RenderItemStartActionArgs
 * @type {RenderCommon}
 * @prop {string} id
 * @prop {string} contentType
 */
export interface RenderItemStartActionArgs extends RenderCommon {
  id: string
  contentType: string
}

/**
 * @typedef RenderItemActionArgs
 * @type {RenderCommon}
 * @prop {string} id
 * @prop {string} contentType
 * @prop {string} slug
 * @prop {string} output
 */
export interface RenderItemActionArgs extends RenderCommon {
  id: string
  contentType: string
  slug: string
  output: string
}

/**
 * @typedef {object} RenderLayoutArgs
 * @prop {string} id
 * @prop {RenderMetaReturn} meta
 * @prop {import('../global/globalTypes').GenericStrings} [navigations]
 * @prop {string} contentType
 * @prop {string} content
 * @prop {string} slug
 * @prop {RenderItem} pageData
 * @prop {string[]} [pageContains]
 * @prop {Array.<import('../text/RichText/RichTextTypes').RichTextHeading[]>} [pageHeadings]
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderLayoutArgs {
  id: string
  meta: RenderMetaReturn
  navigations?: GenericStrings
  contentType: string
  content: string
  slug: string
  pageData: RenderItem
  pageHeadings?: RichTextHeading[][]
  pageContains?: string[]
  serverlessData?: RenderServerlessData | undefined
}

/**
 * @typedef RenderAllData
 * @type {import('../global/globalTypes').Generic}
 * @prop {import('../components/Navigation/NavigationTypes').Navigation[]} navigation
 * @prop {import('../components/Navigation/NavigationTypes').NavigationItem[]} navigationItem
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

/**
 * @typedef {function} RenderContentFilter
 * @param {string} content
 * @param {import('../global/globalTypes').ParentArgs}
 * @return {Promise<string>}
 */
export type RenderContentFilter = (content: string, args: ParentArgs) => Promise<string>

/**
 * @typedef {function} RenderItemFilter
 * @param {string} output
 * @param {RenderItemActionArgs} args
 * @return {Promise<string>}
 */
export type RenderItemFilter = (output: string, args: RenderItemActionArgs) => Promise<string>

/**
 * @typedef {function} RenderNameFilter
 * @param {string} name
 * @return {Promise<string>}
 */
export type RenderNameFilter = (name: string) => Promise<string>

/**
 * @typedef {function} RenderStartAction
 * @param {RenderArgs} args
 * @return {Promise<void>}
 */
export type RenderStartAction = (args: RenderArgs) => Promise<void>

/**
 * @typedef RenderEndActionArgs
 * @type {RenderArgs}
 * @prop {RenderReturn[]|RenderReturn} data
 */
export interface RenderEndActionArgs extends RenderArgs {
  data: RenderReturn[] | RenderReturn
}

/**
 * @typedef {function} RenderEndAction
 * @param {RenderEndActionArgs} args
 * @return {Promise<void>}
 */
export type RenderEndAction = (args: RenderEndActionArgs) => Promise<void>

/**
 * @typedef {function} RenderItemStartAction
 * @param {RenderItemStartActionArgs} args
 * @return {Promise<void>}
 */
export type RenderItemStartAction = (args: RenderItemStartActionArgs) => Promise<void>

/**
 * @typedef {function} RenderItemEndAction
 * @param {RenderItemActionArgs} args
 * @return {Promise<void>}
 */
export type RenderItemEndAction = (args: RenderItemActionArgs) => Promise<void>
