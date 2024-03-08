/**
 * Text - Rich Text Types
 */

import type { Generic, InternalLink, ParentArgs } from '../../global/globalTypes'
import type { PropFile } from '../../utils/getProp/getPropTypes'

/**
 * @typedef {object} RichTextHeading
 * @prop {string} title
 * @prop {string} id
 * @prop {string} type
 */
export interface RichTextHeading {
  title: string
  id: string
  type: string
}

/**
 * @typedef {object} RichTextProps
 * @prop {object} args
 * @prop {string} [args.tag]
 * @prop {string|RichTextContentItem} [args.content]
 * @prop {string} [args.classes]
 * @prop {string} [args.textStyle]
 * @prop {string} [args.headingStyle]
 * @prop {string} [args.caption]
 * @prop {string} [args.align]
 * @prop {string} [args.link]
 * @prop {import('../../global/globalTypes').InternalLink} [args.internalLink]
 * @prop {string} [args.style]
 * @prop {string} [args.attr]
 * @prop {boolean} [args.dataAttr=true]
 * @prop {import('../../global/globalTypes').ParentArgs} [parents]
 * @prop {RichTextHeading[]} [headings]
 */
export interface RichTextProps {
  args: {
    type?: string
    tag?: string
    content?: string | RichTextContentItem[]
    classes?: string
    textStyle?: string
    headingStyle?: string
    caption?: string
    align?: string
    link?: string
    internalLink?: InternalLink
    style?: string
    attr?: string
    dataAttr?: boolean
    [key: string]: unknown
  }
  parents?: ParentArgs[]
  headings?: RichTextHeading[]
}

/**
 * @typedef RichTextContentItem
 * @prop {string} [tag]
 * @prop {string} [link]
 * @prop {import('../../global/globalTypes').InternalLink} [internalLink]
 * @prop {string|RichTextContentItem[]} [content]
 * @prop {string} [nodeType]
 * @prop {string} [value]
 * @prop {RichTextContentItemMark} [marks]
 * @prop {object} [data]
 * @prop {string} [data.uri]
 * @prop {
 * import('../../global/globalTypes').Generic|
 * import('../../utils/getProp/getPropTypes').PropFile|
 * import('../../global/globalTypes').InternalLink
 * } [data.target]
 */
export interface RichTextContentItem {
  tag?: string
  link?: string
  internalLink?: InternalLink
  content?: string | RichTextContentItem[]
  nodeType?: string
  value?: string
  marks?: RichTextContentItemMark[]
  data?: {
    uri?: string
    target?: Generic & InternalLink & PropFile
  }
}

/**
 * @typedef {object} RichTextContentItemMark
 * @prop {string} type
 */
export interface RichTextContentItemMark {
  type: string
}

/**
 * @typedef {object} RichTextContentReturn
 * @prop {string} [tag]
 * @prop {string} [link]
 * @prop {import('../../global/globalTypes').InternalLink} [internalLink]
 * @prop {string|RichTextContentReturn[]} [content]
 */
export interface RichTextContentReturn {
  tag?: string
  link?: string
  internalLink?: InternalLink
  content?: string | RichTextContentReturn[]
}

/**
 * @typedef {object} RichTextContentProps
 * @prop {RichTextContentReturn[]} content
 * @prop {RichTextProps} props
 * @prop {string} _output
 */
export interface RichTextContentProps {
  content: RichTextContentReturn[]
  props: RichTextProps
  _output?: string
}

/**
 * @typedef {object} RichTextContentFilterArgs
 * @prop {RichTextContentItem} args
 * @prop {RichTextProps} props
 */
export interface RichTextContentFilterArgs {
  args: RichTextContentItem
  props: RichTextProps
}

/**
 * @typedef {function} RichTextPropsFilter
 * @prop {RichTextProps} props
 * @prop {object} args
 * @prop {string} args.renderType
 * @return {Promise<RichTextProps>}
 */
export type RichTextPropsFilter = (props: RichTextProps, args: { renderType: string }) => Promise<RichTextProps>

/**
 * @typedef {object} RichTextNormalizeContentFilterArgs
 * @prop {string} type
 * @prop {RichTextContentItem} args
 */
export interface RichTextNormalizeContentFilterArgs {
  type: string
  args: RichTextContentItem
}

/**
 * @typedef {RichTextContentItem[]|string|undefined} RichTextNormalizeContent
 */
type RichTextNormalizeContent = RichTextContentItem[] | string | undefined

/**
 * @typedef {function} RichTextNormalizeContentFilter
 * @param {RichTextNormalizeContent} content
 * @param {RichTextNormalizeContentFilterArgs} args
 * @return {Promise<RichTextNormalizeContent>}
 */
export type RichTextNormalizeContentFilter = (content: RichTextNormalizeContent, args: RichTextNormalizeContentFilterArgs) => Promise<RichTextNormalizeContent>

/**
 * @typedef {function} RichTextContentFilter
 * @param {string} content
 * @param {RichTextContentFilterArgs} args
 * @return {Promise<string>}
 */
export type RichTextContentFilter = (content: string, args: RichTextContentFilterArgs) => Promise<string>

/**
 * @typedef {function} RichTextContentOutputFilter
 * @param {string} content
 * @param {RichTextContentFilterArgs} args
 */
export type RichTextContentOutputFilter = (content: string, args: RichTextContentFilterArgs) => Promise<string>

/**
 * @typedef {function} RichTextOutputFilter
 * @param {string} output
 * @param {RichTextProps} props
 * @return {Promise<string>}
 */
export type RichTextOutputFilter = (output: string, props: RichTextProps) => Promise<string>
