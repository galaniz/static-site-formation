/**
 * Layouts - Column
 */

/* Imports */

import type { ColumnProps, ColumnReturn } from './ColumnTypes'
import { applyFilters, isStringStrict, isObjectStrict } from '../../utils'

/**
 * Function - output column wrapper
 *
 * @param {ColumnProps} props
 * @return {Promise<ColumnReturn>}
 */
const Column = async (props: ColumnProps = { args: {} }): Promise<ColumnReturn> => {
  /* Fallback output */

  const fallback = {
    start: '',
    end: ''
  }

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = await applyFilters('columnProps', props, { renderType: 'Column' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const { args } = props

  const {
    tag = 'div',
    width = '',
    widthSmall = '',
    widthMedium = '',
    widthLarge = '',
    widthCustom = null,
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

  /* Width */

  if (isStringStrict(width)) {
    classesArray.push(width)
  }

  if (isStringStrict(widthSmall) && widthSmall !== width) {
    classesArray.push(widthSmall)
  }

  if (isStringStrict(widthMedium) && widthMedium !== widthSmall) {
    classesArray.push(widthMedium)
  }

  if (isStringStrict(widthLarge) && widthLarge !== widthMedium) {
    classesArray.push(widthLarge)
  }

  /* Justify */

  if (isStringStrict(justify)) {
    classesArray.push(justify)
  }

  /* Align */

  if (isStringStrict(align)) {
    classesArray.push(align)
  }

  /* Style */

  const stylesArray: string[] = []

  if (isStringStrict(style)) {
    stylesArray.push(style)
  }

  if (isObjectStrict(widthCustom)) {
    if (isStringStrict(widthCustom.class)) {
      classesArray.push(widthCustom.class)
    }

    const styleArray = [
      `--width:${isStringStrict(widthCustom.default) ? widthCustom.default : '100%'}`,
      `--width-small:${isStringStrict(widthCustom.small) ? widthCustom.small : '100%'}`,
      `--width-medium:${isStringStrict(widthCustom.medium) ? widthCustom.medium : '100%'}`,
      `--width-large:${isStringStrict(widthCustom.large) ? widthCustom.large : '100%'}`
    ]

    stylesArray.push(styleArray.join(';'))
  }

  const styles = (stylesArray.length > 0) ? ` style="${stylesArray.join(';')}"` : ''

  /* Attributes */

  let attrs = ''

  if (isStringStrict(attr)) {
    attrs = ` ${attr}`
  }

  if (classesArray.length > 0) {
    attrs += ` class="${classesArray.join(' ')}"`
  }

  /* Output */

  return {
    start: `<${tag}${attrs}${styles}>`,
    end: `</${tag}>`
  }
}

/* Exports */

export { Column }
