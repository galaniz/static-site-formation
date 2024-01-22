/**
 * Layouts - Container
 */

/* Imports */

import type { ParentArgs } from '../../global/types/types'
import { applyFilters } from '../../utils/filters/filters'

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
 * @prop {ParentArgs} [parents]
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
    [key: string]: unknown
  }
  parents?: ParentArgs[]
}

/**
 * @typedef {object} ContainerReturn
 * @prop {string} start
 * @prop {string} end
 */

interface ContainerReturn {
  start: string
  end: string
}

/**
 * Function - output container wrapper
 *
 * @param {ContainerProps} props
 * @return {Promise<ContainerReturn>}
 */

const Container = async (props: ContainerProps = { args: {} }): Promise<ContainerReturn> => {
  props = await applyFilters('containerProps', props, { renderType: 'Container' })

  const { args = {} } = props

  const {
    tag = 'div',
    layout = 'column',
    maxWidth = '',
    paddingTop = '',
    paddingTopLarge = '',
    paddingBottom = '',
    paddingBottomLarge = '',
    gap = '',
    gapLarge = '',
    justify = '',
    align = '',
    classes = '',
    style = '',
    attr = ''
  } = args

  /* Classes */

  const classesArray: string[] = []

  if (classes !== '') {
    classesArray.push(classes)
  }

  /* Attributes */

  const attrs: string[] = []

  /* Max width */

  if (maxWidth !== '') {
    classesArray.push(maxWidth)
  }

  /* Layout */

  if (layout !== '') {
    classesArray.push(layout)
  }

  /* Gap */

  if (gap !== '') {
    classesArray.push(gap)
  }

  if (gapLarge !== '' && gapLarge !== gap) {
    classesArray.push(gapLarge)
  }

  /* Justify */

  if (justify !== '') {
    classesArray.push(justify)
  }

  /* Align */

  if (align !== '') {
    classesArray.push(align)
  }

  /* Padding */

  if (paddingTop !== '') {
    classesArray.push(paddingTop)
  }

  if (paddingTopLarge !== '' && paddingTopLarge !== paddingTop) {
    classesArray.push(paddingTopLarge)
  }

  if (paddingBottom !== '') {
    classesArray.push(paddingBottom)
  }

  if (paddingBottomLarge !== '' && paddingBottomLarge !== paddingBottom) {
    classesArray.push(paddingBottomLarge)
  }

  /* Classes */

  if (classesArray.length > 0) {
    attrs.push(`class="${classesArray.join(' ')}"`)
  }

  /* Style */

  if (style !== '') {
    attrs.push(`style="${style}"`)
  }

  /* Attributes */

  if (attr !== '') {
    attrs.push(attr)
  }

  /* Output */

  return {
    start: `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>`,
    end: `</${tag}>`
  }
}

/* Exports */

export { Container }
