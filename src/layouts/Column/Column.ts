/**
 * Layouts - Column
 */

/* Imports */

import type { ParentArgs } from '../../global/types/types'
import { applyFilters, isStringStrict } from '../../utils'

/* Public types */

export interface ColumnProps {
  args: {
    tag?: string
    width?: string
    widthSmall?: string
    widthMedium?: string
    widthLarge?: string
    widthCustom?: {
      class?: string
      default: string
      small: string
      medium: string
      large: string
    }
    justify?: string
    align?: string
    grow?: boolean
    classes?: string
    style?: string
    attr?: string
    [key: string]: unknown
  }
  parents?: ParentArgs[]
}

/**
 * Function - output column wrapper
 *
 * @param {ColumnProps} props
 * @param {object} props.args
 * @param {string} props.args.tag
 * @param {string} props.args.width
 * @param {string} props.args.widthSmall
 * @param {string} props.args.widthMedium
 * @param {string} props.args.widthLarge
 * @param {object} props.args.widthCustom
 * @param {string} props.args.widthCustom.class
 * @param {string} props.args.widthCustom.default
 * @param {string} props.args.widthCustom.small
 * @param {string} props.args.widthCustom.medium
 * @param {string} props.args.widthCustom.large
 * @param {string} props.args.justify
 * @param {string} props.args.align
 * @param {boolean} props.args.grow
 * @param {string} props.args.classes - Back end option
 * @param {string} props.args.style - Back end option
 * @param {string} props.args.attr - Back end option
 * @return {object}
 */

const Column = async (
  props: ColumnProps = {
    args: {}
  }
): Promise<{
  start: string
  end: string
}> => {
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
      `--width:${widthCustom?.default !== undefined ? widthCustom.default : '100%'}`,
      `--width-small:${widthCustom?.small !== undefined ? widthCustom.small : '100%'}`,
      `--width-medium:${widthCustom?.medium !== undefined ? widthCustom.medium : '100%'}`,
      `--width-large:${widthCustom?.large !== undefined ? widthCustom.large : '100%'}`
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
