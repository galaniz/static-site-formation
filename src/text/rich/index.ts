/**
 * Text - rich text
 */

/* Imports */

import getLink from '../../utils/get-link'

/**
 * Function - recursively output content
 *
 * @private
 * @param {object} args
 * @param {array|string} args.content
 * @param {string} args.cardLink
 * @return {string}
 */

interface _ContentProps {
  content: Array<{
    tag?: string
    link?: string
    internalLink?: Formation.InternalLink
    content?: string | object[]
  }>
  cardLink?: string
  _output?: string
}

const _getContent = ({
  content = [],
  cardLink = '',
  _output = ''
}: _ContentProps): string => {
  content.forEach(c => {
    const {
      tag = '',
      link = '',
      internalLink,
      content: con
    } = c

    let cc = con

    /* Nested content */

    if (Array.isArray(con)) {
      cc = _getContent({
        content: con,
        cardLink
      })
    }

    const attr: string[] = []

    if (tag === 'ul' || tag === 'ol' || tag === 'li' || tag === 'blockquote' || tag === 'p' || tag === 'a') {
      attr.push('data-inline')
    }

    if (tag === 'th') {
      attr.push('scope="col"')
    }

    if (tag === 'a') {
      let anchorLink = link

      if (internalLink !== undefined) {
        anchorLink = getLink(internalLink)
      }

      if (anchorLink !== '') {
        attr.push(`href="${anchorLink}"`)
      }
    }

    let outputStr = ''

    if (tag !== '') {
      outputStr += `<${tag}${(attr.length > 0) ? ` ${attr.join(' ')}` : ''}>`
    }

    if (typeof cc === 'string') {
      outputStr += cc
    }

    if (tag !== '') {
      outputStr += `</${tag}>`
    }

    if (outputStr !== '' && tag === 'blockquote') {
      outputStr = `<figure data-quote>${outputStr}</figure>`
    }

    _output += outputStr
  })

  return _output
}

/**
 * Function - output rich text
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.tag
 * @param {string|array<object>} props.args.content
 * @param {string} props.args.classes
 * @param {string} props.args.textStyle
 * @param {string} props.args.headingStyle
 * @param {string} props.args.align
 * @param {string} props.args.link
 * @param {object} props.args.internalLink
 * @param {object} props.args.style
 * @param {array<object>} props.parents
 * @return {string}
 */

interface RichTextProps {
  args: {
    tag?: string
    content?: string | object[]
    classes?: string
    textStyle?: string
    headingStyle?: string
    caption?: string
    align?: string
    link?: string
    internalLink?: Formation.InternalLink
    style?: object
  }
  parents?: Array<{
    renderType: string
    internalLink?: Formation.InternalLink
    externalLink?: string
  }>
}

const richText = (props: RichTextProps = { args: {}, parents: [] }): string => {
  const { args = {}, parents = [] } = props

  const {
    tag = '',
    content = [],
    classes = '',
    textStyle = '',
    headingStyle = '',
    caption = '',
    align = '',
    link = '',
    internalLink,
    style
  } = args

  /* Hr */

  if (tag === 'hr') {
    return '<hr>'
  }

  /* Check if heading */

  const heading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)

  /* Check content and card parent */

  let cardLink = ''
  let cardProtected = false
  let card = false

  if (parents.length > 0) {
    if (parents[0].renderType === 'card') {
      card = true
    }

    if (card && heading) {
      const {
        internalLink: cardInternalLink,
        externalLink = ''
      } = parents[0]

      if (cardInternalLink?.passwordProtected !== undefined) {
        cardProtected = cardInternalLink.passwordProtected
      }

      cardLink = getLink(cardInternalLink, externalLink)
    }
  }

  /* Classes */

  const classesArray: string[] = []

  if (classes !== '') {
    classesArray.push(classes)
  }

  if (card && tag === 'p') {
    classesArray.push('t-link-current')
  }

  if (textStyle !== '' && (tag === 'p' || tag === 'li' || tag === 'ul' || tag === 'ol' || tag === 'blockquote' || tag === 'table')) {
    classesArray.push(textStyle === 'default' ? 't' : `t-${textStyle}`)
  }

  if (tag === 'blockquote') {
    classesArray.push('t-quote')
  }

  if (headingStyle !== '' && heading) {
    classesArray.push(`t-${headingStyle}`)
  }

  if (align !== '') {
    classesArray.push(`t-align-${align}`)
  }

  /* Generate output */

  let output = ''

  if (Array.isArray(content)) {
    output = _getContent({
      content,
      cardLink
    })
  } else {
    output = content
  }

  /* Attributes */

  const attr: string[] = []

  if (heading) {
    attr.push(`id="${output.replace(/[\s,:;"'“”‘’]/g, '-').toLowerCase()}"`)
  }

  if (tag === 'ul' || tag === 'ol' || tag === 'blockquote' || tag === 'p' || tag === 'a') {
    attr.push('data-inline')
  }

  if (tag === 'a') {
    let anchorLink = link

    if (internalLink !== undefined) {
      anchorLink = getLink(internalLink)
    }

    if (anchorLink !== '') {
      attr.push(`href="${anchorLink}"`)
    }
  }

  if (classesArray.length > 0) {
    attr.push(`class="${classesArray.join(' ')}"`)
  }

  if (style !== undefined) {
    const styleArray: string[] = []

    Object.keys(style).forEach((s) => {
      const st: string = style[s]

      styleArray.push(`${s}:${st}`)
    })

    attr.push(`style="${styleArray.join(';')}"`)
  }

  /* Card */

  if (cardLink !== '' && typeof content === 'string') {
    let icon = ''

    if (cardProtected) {
      icon = lockSvg('l-width-s l-height-s', '(password protected)')
    }

    output = `<a class="l-before outline-tight" href="${cardLink}" data-inline>${content}</a>&nbsp;${icon}`
  }

  /* Output */

  if (tag !== '') {
    output = `<${tag}${(attr.length > 0) ? ` ${attr.join(' ')}` : ''}>${output}</${tag}>`

    if (tag === 'blockquote') {
      if (caption !== '') {
        output = `${output}<figcaption class="t-s l-padding-top-2xs">${caption}</figcaption>`
      }

      output = `<figure data-quote>${output}</figure>`
    }
  }

  return output
}

/* Exports */

export default richText
