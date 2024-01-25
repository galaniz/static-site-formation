/**
 * Text - Rich Text Types
 */

import type { InternalLink, ParentArgs } from '../../global/globalTypes'
import type { RenderRichTextDataTargetProp } from '../../render/RenderTypes'

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
 * @prop {InternalLink} [args.internalLink]
 * @prop {string} [args.style]
 * @prop {string} [args.attr]
 * @prop {ParentArgs} [parents]
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
    [key: string]: unknown
  }
  parents?: ParentArgs[]
}

/**
 * @typedef {object} RichTextContentItem
 * @prop {string} [tag]
 * @prop {string} [link]
 * @prop {InternalLink} [internalLink]
 * @prop {string|RichTextContentItem[]} [content]
 * @prop {string} [nodeType]
 * @prop {string} [value]
 * @prop {RichTextContentItemMark} [marks]
 * @prop {object} [data]
 * @prop {string} [data.uri]
 * @prop {RenderRichTextDataTargetProp} [data.target]
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
    target?: RenderRichTextDataTargetProp
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
 * @prop {InternalLink} [internalLink]
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
 * @typedef {object} RichTextNormalizeContentFilterArgs
 * @prop {string} type
 * @prop {RichTextContentItem} args
 */
export interface RichTextNormalizeContentFilterArgs {
  type: string
  args: RichTextContentItem
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
