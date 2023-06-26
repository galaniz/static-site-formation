/**
 * Render - container
 */

/* Imports */

import { applyFilters } from '../../utils/filters'
import isString from '../../utils/is-string'

/**
 * Function - output container wrapper
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.tag
 * @param {string} props.args.layout
 * @param {string} props.args.maxWidth
 * @param {string} props.args.paddingTop
 * @param {string} props.args.paddingTopLarge
 * @param {string} props.args.paddingBottom
 * @param {string} props.args.paddingBottomLarge
 * @param {string} props.args.gap
 * @param {string} props.args.gapLarge
 * @param {string} props.args.justify
 * @param {string} props.args.align
 * @param {boolean} props.args.richTextStyles
 * @param {string} props.args.classes // Back end option
 * @param {string} props.args.style // Back end option
 * @param {string} props.args.attr // Back end option
 * @return {object}
 */

interface Props {
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
  }
  parents?: object[]
}

const container = (props: Props = { args: {} }): Formation.Return => {
  props = applyFilters('containerProps', props, ['container'])

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

  if (isString(classes)) {
    classesArray.push(classes)
  }

  /* Attributes */

  const attrs: string[] = []

  /* Max width */

  if (isString(maxWidth)) {
    classesArray.push(maxWidth)
  }

  /* Layout */

  if (isString(layout)) {
    classesArray.push(layout)
  }

  /* Gap */

  if (isString(gap)) {
    classesArray.push(gap)
  }

  if (isString(gapLarge) && gapLarge !== gap) {
    classesArray.push(gapLarge)
  }

  /* Justify */

  if (isString(justify)) {
    classesArray.push(justify)
  }

  /* Align */

  if (isString(align)) {
    classesArray.push(align)
  }

  /* Padding */

  if (isString(paddingTop)) {
    classesArray.push(paddingTop)
  }

  if (isString(paddingTopLarge) && paddingTopLarge !== paddingTop) {
    classesArray.push(paddingTopLarge)
  }

  if (isString(paddingBottom)) {
    classesArray.push(paddingBottom)
  }

  if (isString(paddingBottomLarge) && paddingBottomLarge !== paddingBottom) {
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

export default container
