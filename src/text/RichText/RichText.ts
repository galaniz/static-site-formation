/**
 * Text - Rich Text
 */

/* Imports */

import type {
  RichTextProps,
  RichTextContentItem,
  RichTextContentReturn,
  RichTextContentProps,
  RichTextNormalizeContentFilterArgs,
  RichTextContentFilterArgs
} from './RichTextTypes'
import {
  getLink,
  getProp,
  applyFilters,
  isString,
  isStringStrict,
  isObjectStrict,
  isArrayStrict
} from '../../utils/'

/**
 * Function - get html tag from type
 *
 * @private
 * @param {string} type
 * @return {string}
 */
const _getTag = (type: string = 'text'): string => {
  let tag = ''

  switch (type) {
    case 'hr':
      tag = 'hr'
      break
    case 'paragraph':
      tag = 'p'
      break
    case 'blockquote':
      tag = 'blockquote'
      break
    case 'bold':
      tag = 'b'
      break
    case 'italic':
      tag = 'i'
      break
    case 'underline':
      tag = 'u'
      break
    case 'superscript':
      tag = 'sup'
      break
    case 'subscript':
      tag = 'sub'
      break
    case 'code':
      tag = 'code'
      break
    case 'hyperlink':
    case 'entry-hyperlink':
    case 'asset-hyperlink':
      tag = 'a'
      break
    case 'text':
      tag = ''
      break
    case 'heading-1':
      tag = 'h1'
      break
    case 'heading-2':
      tag = 'h2'
      break
    case 'heading-3':
      tag = 'h3'
      break
    case 'heading-4':
      tag = 'h4'
      break
    case 'heading-5':
      tag = 'h5'
      break
    case 'heading-6':
      tag = 'h6'
      break
    case 'list-item':
      tag = 'li'
      break
    case 'unordered-list':
      tag = 'ul'
      break
    case 'ordered-list':
      tag = 'ol'
      break
    case 'table':
      tag = 'table'
      break
    case 'table-row':
      tag = 'tr'
      break
    case 'table-cell':
      tag = 'td'
      break
    case 'table-header-cell':
      tag = 'th'
      break
    default:
      tag = ''
      break
  }

  return tag
}

/**
 * Function - convert to more standard objects
 *
 * @private
 * @param {RichTextContentItem[]} content
 * @return {RichTextContentReturn[]|[]}
 */
const _normalizeContent = async (content: RichTextContentItem[]): Promise<RichTextContentReturn[] | []> => {
  if (!isArrayStrict(content)) {
    return []
  }

  const normalContent = []

  for (let i = 0; i < content.length; i += 1) {
    const c: RichTextContentItem = content[i]

    const {
      nodeType = '',
      data,
      value,
      marks
    } = c

    let {
      tag = '',
      link = '',
      internalLink,
      content: con
    } = c

    /* Type for filter */

    const filterType = nodeType !== '' ? nodeType : tag

    /* Tag */

    if (nodeType !== '') {
      tag = _getTag(nodeType)
    }

    /* Content */

    let contentValue

    if (isStringStrict(value)) {
      contentValue = value

      if (isArrayStrict(marks)) {
        const markTags = marks.map((m) => {
          return _getTag(m.type)
        })

        const markStart = markTags.map(m => `<${m}>`).join('')
        const markEnd = markTags.map(m => `</${m}>`).join('')

        contentValue = `${markStart}${value}${markEnd}`
      }
    }

    if (isStringStrict(con)) {
      contentValue = con
    }

    if (isArrayStrict(con)) {
      contentValue = await _normalizeContent(con)
    }

    const richTextNormalizeContentFilterArgs: RichTextNormalizeContentFilterArgs = {
      type: filterType,
      args: c
    }

    contentValue = await applyFilters(
      'richTextNormalizeContent',
      contentValue,
      richTextNormalizeContentFilterArgs
    )

    /* Link */

    if (isObjectStrict(data)) {
      link = isStringStrict(data.uri) ? data.uri : ''

      if (isObjectStrict(data.target)) {
        const target = data.target

        if (nodeType === 'entry-hyperlink') {
          internalLink = target
        }

        const url = getProp.file(target, 'url')

        if (nodeType === 'asset-hyperlink' && isStringStrict(url)) {
          link = url
        }
      }
    }

    /* Output */

    const obj: RichTextContentReturn = { tag, content: contentValue }

    if (isStringStrict(link)) {
      obj.link = link
    }

    if (isObjectStrict(internalLink)) {
      obj.internalLink = internalLink
    }

    normalContent[i] = obj
  }

  return normalContent
}

/**
 * Function - recursively output content
 *
 * @private
 * @param {RichTextContentProps} args
 * @return {Promise<string>}
 */
const _getContent = async ({ content = [], props, _output = '' }: RichTextContentProps): Promise<string> => {
  for (let i = 0; i < content.length; i += 1) {
    const c = content[i]

    const {
      tag = '',
      link = '',
      internalLink,
      content: con
    } = c

    let cc = con

    /* Nested content */

    if (isArrayStrict(con)) {
      cc = await _getContent({
        content: con,
        props
      })
    }

    const attrs: string[] = [`data-rich="${tag}"`]

    if (tag === 'a') {
      let anchorLink = link

      if (internalLink !== undefined && internalLink !== null) {
        anchorLink = getLink(internalLink)
      }

      if (anchorLink !== '') {
        attrs.push(`href="${anchorLink}"`)
      }
    }

    let outputStr = ''

    if (isString(cc)) {
      const richTextContentFilterArgs: RichTextContentFilterArgs = {
        args: c,
        props
      }

      const ccc = await applyFilters('richTextContent', cc, richTextContentFilterArgs)

      if (isString(ccc)) {
        cc = ccc
      }

      outputStr += cc
    }

    if (isStringStrict(tag) && outputStr !== '') {
      outputStr = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>${outputStr}</${tag}>`
    }

    const richTextContentOutput: RichTextContentFilterArgs = {
      args: c,
      props
    }

    outputStr = await applyFilters('richTextContentOutput', outputStr, richTextContentOutput)

    _output += outputStr
  }

  return _output
}

/**
 * Function - output rich text
 *
 * @param {RichTextProps} props
 * @return {Promise<string>}
 */
const RichText = async (props: RichTextProps = { args: {}, parents: [] }): Promise<string> => {
  /* Props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  props = await applyFilters('richTextProps', props, { renderType: 'RichText' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  let { args } = props

  args = isObjectStrict(args) ? args : {}

  const {
    type = '',
    classes = '',
    link = '',
    internalLink,
    textStyle = '',
    headingStyle = '',
    align = '',
    style = '',
    attr = ''
  } = args

  let {
    tag = '',
    content = []
  } = args

  if (isStringStrict(type)) {
    tag = _getTag(type)
  }

  let contentNormal: RichTextContentReturn[] = []

  if (isArrayStrict(content)) {
    contentNormal = await _normalizeContent(content)
  }

  /* Hr */

  if (tag === 'hr') {
    return '<hr>'
  }

  /* Check if heading */

  const heading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)

  /* Classes */

  const classesArray: string[] = []

  if (isStringStrict(classes)) {
    classesArray.push(classes)
  }

  if (isStringStrict(textStyle)) {
    classesArray.push(textStyle)
  }

  if (isStringStrict(headingStyle) && heading) {
    classesArray.push(headingStyle)
  }

  if (isStringStrict(align)) {
    classesArray.push(align)
  }

  /* Generate output */

  let output = ''

  if (isStringStrict(content)) {
    output = content
  }

  if (isArrayStrict(contentNormal)) {
    output = await _getContent({
      content: contentNormal,
      props
    })
  }

  /* Attributes */

  const attrs: string[] = [`data-rich="${tag}"`]

  if (heading && isString(content)) {
    attrs.push(`id="${content.replace(/[\s,:;"'“”‘’]/g, '-').toLowerCase()}"`)
  }

  if (tag === 'a') {
    let anchorLink = link

    const inLink = getLink(internalLink)

    if (isStringStrict(inLink)) {
      anchorLink = inLink
    }

    if (anchorLink !== '') {
      attrs.push(`href="${anchorLink}"`)
    }
  }

  if (classesArray.length > 0) {
    attrs.push(`class="${classesArray.join(' ')}"`)
  }

  if (isStringStrict(style)) {
    attrs.push(`style="${style}"`)
  }

  if (isStringStrict(attr)) {
    attrs.push(attr)
  }

  /* Output */

  if (tag !== '' && output !== '') {
    output = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>${output}</${tag}>`
  }

  output = await applyFilters('richTextOutput', output, props)

  return output
}

/* Exports */

export { RichText }
