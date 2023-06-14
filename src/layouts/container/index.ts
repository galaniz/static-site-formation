/**
 * Render - container
 */

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
 * @param {string} props.args.classes
 * @param {string} props.args.attr // Back end option
 * @param {string} props.args.richTextStyles // Back end option
 * @return {object}
 */

const container = (props: Render.ContainerProps = { args: {} }): Render.Return => {
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
    attr = '',
    richTextStyles = false
  } = args

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
    classesArray.push('t-list-style-none')
  }

  /* Max width */

  if (maxWidth !== '') {
    classesArray.push(`l-container${maxWidth !== 'default' ? `-${maxWidth}` : ''}`)
  }

  /* Flex */

  if (layout === 'column' && (justify !== '' || align !== '')) {
    classesArray.push('l-flex l-flex-column')
  }

  if (layout === 'row') {
    classesArray.push('l-flex l-flex-wrap')
  }

  /* Gap */

  if (gap !== '') {
    if (layout === 'row') {
      classesArray.push(`l-gap-margin-${gap}`)
    } else {
      classesArray.push(`l-margin-bottom-${gap}-all`)
    }
  }

  if (gapLarge !== '' && gapLarge !== gap) {
    if (layout === 'row') {
      classesArray.push(`l-gap-margin-${gapLarge}-l`)
    } else {
      classesArray.push(`l-margin-bottom-${gapLarge}-all-l`)
    }
  }

  /* Justify */

  if (justify !== '') {
    classesArray.push(`l-justify-${justify}`)
  }

  /* Align */

  if (align !== '') {
    classesArray.push(`l-align-${align}`)
  }

  /* Padding */

  if (paddingTop !== '') {
    classesArray.push(`l-padding-top-${paddingTop}`)
  }

  if (paddingTopLarge !== '' && paddingTopLarge !== paddingTop) {
    classesArray.push(`l-padding-top-${paddingTopLarge}-m`)
  }

  if (paddingBottom !== '') {
    classesArray.push(`l-padding-bottom-${paddingBottom}`)
  }

  if (paddingBottomLarge !== '' && paddingBottomLarge !== paddingBottom) {
    classesArray.push(`l-padding-bottom-${paddingBottomLarge}-m`)
  }

  /* Rich text styles */

  if (richTextStyles) {
    classesArray.push('t-rich-text e-underline')

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
