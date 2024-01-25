/**
 * Layouts - Container
 */

/* Imports */

import type { ContainerProps, ContainerReturn } from './ContainerTypes'
import { applyFilters } from '../../utils/filters/filters'

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
