/**
 * Layouts - Container Types
 */

/* Imports */

import type { ParentArgs } from '../../global/globalTypes'

/**
 * @typedef {object} ContainerProps
 * @prop {object} args
 * @prop {string} [args.tag]
 * @prop {string} [args.layout]
 * @prop {string} [args.maxWidth]
 * @prop {string} [args.paddingTop]
 * @prop {string} [args.paddingTopLarge]
 * @prop {string} [args.paddingBottom]
 * @prop {string} [args.paddingBottomLarge]
 * @prop {string} [args.gap]
 * @prop {string} [args.gapLarge]
 * @prop {string} [args.justify]
 * @prop {string} [args.align]
 * @prop {boolean} [args.richTextStyles]
 * @prop {string} [args.classes] - Back end option
 * @prop {string} [args.style] - Back end option
 * @prop {string} [args.attr] - Back end option
 * @prop {boolean} [args.nest] - Back end option
 * @prop {import('../../global/globalTypes').ParentArgs} [parents]
 */
export interface ContainerProps {
  args: {
    tag?: string
    layout?: string
    maxWidth?: string
    paddingTop?: string
    paddingTopLarge?: string
    paddingBottom?: string
    paddingBottomLarge?: string
    gap?: string
    gapLarge?: string
    justify?: string
    align?: string
    classes?: string
    style?: string
    attr?: string
    richTextStyles?: boolean
    nest?: boolean
    [key: string]: unknown
  }
  parents?: ParentArgs[]
}

/**
 * @typedef {object} ContainerReturn
 * @prop {string} start
 * @prop {string} end
 */
export interface ContainerReturn {
  start: string
  end: string
}

/**
 * @typedef {function} ContainerPropsFilter
 * @prop {ContainerProps} props
 * @prop {object} args
 * @prop {string} args.renderType
 * @return {Promise<ContainerProps>}
 */
export type ContainerPropsFilter = (props: ContainerProps, args: { renderType: string }) => Promise<ContainerProps>
