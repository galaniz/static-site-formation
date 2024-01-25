/**
 * Layouts - Column
 */

/* Imports */

import type { ColumnProps, ColumnReturn } from './ColumnTypes'
import { applyFilters, isStringStrict } from '../../utils'

/**
 * Function - output column wrapper
 *
 * @param {ColumnProps} props
 * @return {Promise<ColumnReturn>}
 */
const Column = async (props: ColumnProps = { args: {} }): Promise<ColumnReturn> => {
  props = await applyFilters('columnProps', props, { renderType: 'Column' })

  const { args = {} } = props

  const {
    tag = 'div',
    width = '',
    widthSmall = '',
    widthMedium = '',
    widthLarge = '',
    widthCustom,
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

  /* Width */

  if (width !== '') {
    classesArray.push(width)
  }

  if (widthSmall !== '' && widthSmall !== width) {
    classesArray.push(widthSmall)
  }

  if (widthMedium !== '' && widthMedium !== widthSmall) {
    classesArray.push(widthMedium)
  }

  if (widthLarge !== '' && widthLarge !== widthMedium) {
    classesArray.push(widthLarge)
  }

  /* Justify */

  if (justify !== '') {
    classesArray.push(justify)
  }

  /* Align */

  if (align !== '') {
    classesArray.push(align)
  }

  /* Style */

  const stylesArray: string[] = []

  if (style !== '') {
    stylesArray.push(style)
  }

  if (widthCustom !== undefined) {
    if (isStringStrict(widthCustom.class)) {
      classesArray.push(widthCustom.class)
    }

    const styleArray = [
      `--width:${widthCustom.default !== undefined ? widthCustom.default : '100%'}`,
      `--width-small:${widthCustom.small !== undefined ? widthCustom.small : '100%'}`,
      `--width-medium:${widthCustom.medium !== undefined ? widthCustom.medium : '100%'}`,
      `--width-large:${widthCustom.large !== undefined ? widthCustom.large : '100%'}`
    ]

    stylesArray.push(styleArray.join(';'))
  }

  const styles = (stylesArray.length > 0) ? ` style="${stylesArray.join(';')}"` : ''

  /* Attributes */

  let attrs = ''

  if (attr !== '') {
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
