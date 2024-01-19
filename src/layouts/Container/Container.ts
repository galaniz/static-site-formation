/**
 * Layouts - Container
 */

/* Imports */

import { applyFilters } from '../../utils/filters/filters'

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
 * @param {string} props.args.classes - Back end option
 * @param {string} props.args.style - Back end option
 * @param {string} props.args.attr - Back end option
 * @return {object}
 */

const Container = async (props: FRM.ContainerProps = { args: {} }): Promise<FRM.StartEndReturn> => {
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
