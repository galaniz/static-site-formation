/**
 * Layouts - Container
 */

/* Imports */

import type { ContainerProps, ContainerReturn } from './ContainerTypes'
import { applyFilters, isObjectStrict, isStringStrict } from '../../utils'

/**
 * Function - output container wrapper
 *
 * @param {ContainerProps} props
 * @return {Promise<ContainerReturn>}
 */
const Container = async (props: ContainerProps = { args: {} }): Promise<ContainerReturn> => {
  /* Fallback output */

  const fallback = {
    start: '',
    end: ''
  }

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = await applyFilters('containerProps', props, { renderType: 'Container' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const { args } = props

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
  } = isObjectStrict(args) ? args : {}

  /* Classes */

  const classesArray: string[] = []

  if (isStringStrict(classes)) {
    classesArray.push(classes)
  }

  /* Attributes */

  const attrs: string[] = []

  /* Max width */

  if (isStringStrict(maxWidth)) {
    classesArray.push(maxWidth)
  }

  /* Layout */

  if (isStringStrict(layout)) {
    classesArray.push(layout)
  }

  /* Gap */

  if (isStringStrict(gap)) {
    classesArray.push(gap)
  }

  if (isStringStrict(gapLarge) && gapLarge !== gap) {
    classesArray.push(gapLarge)
  }

  /* Justify */

  if (isStringStrict(justify)) {
    classesArray.push(justify)
  }

  /* Align */

  if (isStringStrict(align)) {
    classesArray.push(align)
  }

  /* Padding */

  if (isStringStrict(paddingTop)) {
    classesArray.push(paddingTop)
  }

  if (isStringStrict(paddingTopLarge) && paddingTopLarge !== paddingTop) {
    classesArray.push(paddingTopLarge)
  }

  if (isStringStrict(paddingBottom)) {
    classesArray.push(paddingBottom)
  }

  if (isStringStrict(paddingBottomLarge) && paddingBottomLarge !== paddingBottom) {
    classesArray.push(paddingBottomLarge)
  }

  /* Classes */

  if (classesArray.length > 0) {
    attrs.push(`class="${classesArray.join(' ')}"`)
  }

  /* Style */

  if (isStringStrict(style)) {
    attrs.push(`style="${style}"`)
  }

  /* Attributes */

  if (isStringStrict(attr)) {
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
