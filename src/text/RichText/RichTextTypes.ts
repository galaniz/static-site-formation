/**
 * Text - Rich Text Types
 */

/* Imports */

import type { InternalLink, ParentArgs } from '../../global/globalTypes'
import type { RenderRichText } from '../../render/renderTypes'

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
 * @prop {RenderRichText[]|string} [args.content]
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
    tag?: string
    content?: RenderRichText[] | string
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
 * @typedef {object} RichTextContentProps
 * @prop {RenderRichText[]} content
 * @prop {RichTextProps} props
 * @prop {boolean} dataAttr
 * @prop {string} [_output]
 */
export interface RichTextContentProps {
  content: RenderRichText[]
  props: RichTextProps
  dataAttr: boolean
  _output?: string
}

/**
 * @typedef {object} RichTextContentFilterArgs
 * @prop {RenderRichText} args
 * @prop {RichTextProps} props
 */
export interface RichTextContentFilterArgs {
  args: RenderRichText
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
