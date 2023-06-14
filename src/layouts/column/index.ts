/**
 * Layouts - column
 */

/* Imports */

import getNormalParam from '../../utils/get-normal-param'

/**
 * Function - output column wrapper
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.tag
 * @param {string} props.args.width
 * @param {string} props.args.widthSmall
 * @param {string} props.args.widthMedium
 * @param {string} props.args.widthLarge
 * @param {object} props.args.widthCustom
 * @param {string} props.args.widthCustom.default
 * @param {string} props.args.widthCustom.small
 * @param {string} props.args.widthCustom.medium
 * @param {string} props.args.widthCustom.large
 * @param {string} props.args.justify
 * @param {string} props.args.align
 * @param {boolean} props.args.grow
 * @param {string} props.args.classes // Back end option
 * @param {string} props.args.style // Back end option
 * @param {string} props.args.attr // Back end option
 * @return {object}
 */

const column = (props: Formation.ColumnProps = { args: {} }): Formation.Return => {
  const { args = {} } = props

  let {
    tag = 'div',
    width = '',
    widthSmall = '',
    widthMedium = '',
    widthLarge = '',
    widthCustom,
    justify = '',
    align = '',
    classes = '',
    grow = false,
    style = '',
    attr = ''
  } = args

  tag = getNormalParam('tag', tag)
  width = getNormalParam('width', width)
  widthSmall = getNormalParam('width', widthSmall)
  widthMedium = getNormalParam('width', widthMedium)
  widthLarge = getNormalParam('width', widthLarge)
  justify = getNormalParam('justify', justify)
  align = getNormalParam('align', align)

  /* Classes */

  const classesArray: string[] = []

  if (classes !== '') {
    classesArray.push(classes)
  }

  /* Width */

  if (width === '' && widthCustom === undefined) {
    width = '1-1'
  }

  if (width !== '') {
    classesArray.push(`l-width-${width}`)
  }

  if (widthSmall !== '' && widthSmall !== width) {
    classesArray.push(`l-width-${widthSmall}-s`)
  }

  if (widthMedium !== '' && widthMedium !== widthSmall) {
    classesArray.push(`l-width-${widthMedium}-m`)
  }

  if (widthLarge !== '' && widthLarge !== widthMedium) {
    classesArray.push(`l-width-${widthLarge}-l`)
  }

  /* Justify */

  if (justify !== '') {
    classesArray.push(`l-justify-${justify}`)
  }

  /* Align */

  if (align !== '') {
    classesArray.push(`l-align-${align}`)
  }

  /* Grow */

  if (grow) {
    classesArray.push('l-flex-grow-1')
  }

  /* Style */

  const stylesArray: string[] = []

  if (style !== '') {
    stylesArray.push(style)
  }

  if (widthCustom !== undefined) {
    classesArray.push('l-width-custom')

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

  /* Output */

  return {
    start: `<${tag} class="${classesArray.join(' ')}"${styles}${attrs}>`,
    end: `</${tag}>`
  }
}

/* Exports */

export default column
