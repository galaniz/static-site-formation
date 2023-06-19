/**
 * Render - container
 */

/* Imports */

import { config } from '../../config'
import getNormalParam from '../../utils/get-normal-param'

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
 * @param {string} props.args.richTextStyles
 * @param {string} props.args.classes // Back end option
 * @param {string} props.args.attr // Back end option
 * @return {object}
 */

const container = (props: Formation.ContainerProps = { args: {} }): Formation.Return => {
  const { args = {} } = props

  let {
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
    richTextStyles = '',
    classes = '',
    attr = ''
  } = args

  tag = getNormalParam('tag', tag)
  layout = getNormalParam('layout', layout)
  maxWidth = getNormalParam('maxWidth', maxWidth)
  paddingTop = getNormalParam('paddingTop', paddingTop)
  paddingTopLarge = getNormalParam('paddingTopLarge', paddingTopLarge)
  paddingBottom = getNormalParam('paddingBottom', paddingBottom)
  paddingBottomLarge = getNormalParam('paddingBottomLarge', paddingBottomLarge)
  gap = getNormalParam('gap', gap)
  gapLarge = getNormalParam('gapLarge', gapLarge)
  justify = getNormalParam('justify', justify)
  align = getNormalParam('align', align)
  richTextStyles = getNormalParam('richTextStyles', richTextStyles)

  /* Classes */

  const classesArray: string[] = []

  if (classes !== '') {
    classesArray.push(classes)
  }

  /* Attributes */

  const attrs: string[] = []

  /* List check */

  if (tag === 'ul' || tag === 'ol') {
    attrs.push('role="list"')
    classesArray.push(config.classNames.list)
  }

  /* Max width */

  if (maxWidth !== '') {
    classesArray.push(`${config.classNames.maxWidth}${maxWidth !== 'default' ? `-${maxWidth}` : ''}`)
  }

  /* Flex */

  if (layout === 'column' && (justify !== '' || align !== '')) {
    classesArray.push(config.classNames.column)
  }

  if (layout === 'row') {
    classesArray.push(config.classNames.row)
  }

  /* Gap */

  const gapRowClass = config.classNames.gap.row
  const gapColumnClass = config.classNames.gap.column

  if (gap !== '') {
    if (layout === 'row') {
      classesArray.push(`${gapRowClass}-${gap}`)
    } else {
      classesArray.push(`${gapColumnClass}-${gap}`)
    }
  }

  if (gapLarge !== '' && gapLarge !== gap) {
    if (layout === 'row') {
      classesArray.push(`${gapRowClass}-${gapLarge}`)
    } else {
      classesArray.push(`${gapColumnClass}-${gapLarge}`)
    }
  }

  /* Justify */

  if (justify !== '') {
    classesArray.push(`${config.classNames.justify}-${justify}`)
  }

  /* Align */

  if (align !== '') {
    classesArray.push(`${config.classNames.align}-${align}`)
  }

  /* Padding */

  const paddingTopClass = config.classNames.padding.top
  const paddingBottomClass = config.classNames.padding.bottom

  if (paddingTop !== '') {
    classesArray.push(`${paddingTopClass}-${paddingTop}`)
  }

  if (paddingTopLarge !== '' && paddingTopLarge !== paddingTop) {
    classesArray.push(`${paddingTopClass}-${paddingTopLarge}`)
  }

  if (paddingBottom !== '') {
    classesArray.push(`${paddingBottomClass}-${paddingBottom}`)
  }

  if (paddingBottomLarge !== '' && paddingBottomLarge !== paddingBottom) {
    classesArray.push(`${paddingBottomClass}-${paddingBottomLarge}`)
  }

  /* Rich text styles */

  if (richTextStyles !== '') {
    classesArray.push(config.classNames.richText)

    if (gap === '' && gapLarge === '' && layout === 'column') {
      attrs.push('data-mb')
    }
  }

  /* Classes */

  if (classesArray.length > 0) {
    attrs.push(`class="${classesArray.join(' ')}"`)
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
