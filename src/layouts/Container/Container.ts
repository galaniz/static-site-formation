/**
 * Layouts - Container
 */

/* Imports */

import type { ContainerProps, ContainerReturn } from './ContainerTypes'
import { applyFilters, isObjectStrict, isStringStrict } from '../../utils/utilsMin'

/**
 * Function - output container wrapper
 *
 * @param {import('./ContainerTypes').ContainerProps} props
 * @return {Promise<import('./ContainerTypes').ContainerReturn>}
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

  let { args } = props

  args = isObjectStrict(args) ? args : {}

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
    attr = '',
    nest = false
  } = args

  /* Classes */

  const classesArr: string[] = []
  const layoutClassesArr: string[] = []

  if (isStringStrict(classes)) {
    classesArr.push(classes)
  }

  /* Attributes */

  const attrs: string[] = []

  /* Max width */

  if (isStringStrict(maxWidth)) {
    classesArr.push(maxWidth)
  }

  /* Layout */

  if (isStringStrict(layout)) {
    layoutClassesArr.push(layout)
  }

  /* Gap */

  if (isStringStrict(gap)) {
    layoutClassesArr.push(gap)
  }

  if (isStringStrict(gapLarge) && gapLarge !== gap) {
    layoutClassesArr.push(gapLarge)
  }

  /* Justify */

  if (isStringStrict(justify)) {
    layoutClassesArr.push(justify)
  }

  /* Align */

  if (isStringStrict(align)) {
    layoutClassesArr.push(align)
  }

  /* Padding */

  if (isStringStrict(paddingTop)) {
    classesArr.push(paddingTop)
  }

  if (isStringStrict(paddingTopLarge) && paddingTopLarge !== paddingTop) {
    classesArr.push(paddingTopLarge)
  }

  if (isStringStrict(paddingBottom)) {
    classesArr.push(paddingBottom)
  }

  if (isStringStrict(paddingBottomLarge) && paddingBottomLarge !== paddingBottom) {
    classesArr.push(paddingBottomLarge)
  }

  /* Nest check */

  const isNested = nest && layoutClassesArr.length > 0

  /* Classes */

  const outerClassesArr = isNested ? classesArr : classesArr.concat(layoutClassesArr)

  if (outerClassesArr.length > 0) {
    attrs.push(`class="${outerClassesArr.join(' ')}"`)
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

  let outerTag = tag
  let innerTag = ''

  if (isNested) {
    const isList = tag === 'ul' || tag === 'ol'

    outerTag = isList ? 'div' : tag
    innerTag = isList ? tag : 'div'
  }

  let start = `<${outerTag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>`
  let end = `</${outerTag}>`

  if (innerTag !== '') {
    start = `${start}<${innerTag} class="${layoutClassesArr.join(' ')}">`
    end = `</${innerTag}>${end}`
  }

  return {
    start,
    end
  }
}

/* Exports */

export { Container }
