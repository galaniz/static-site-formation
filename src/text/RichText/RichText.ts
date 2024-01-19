/**
 * Text - Rich Text
 */

/* Imports */

import { getLink } from '../../utils/getLink/getLink'
import { applyFilters } from '../../utils/filters/filters'

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
 * @param {object[]} content
 * @return {object[]}
 */

interface _RichTextContentReturn {
  tag: string | string[]
  link?: string
  internalLink?: FRM.InternalLink
  content: string | _RichTextContentReturn[]
}

const _normalizeContent = async (content: FRM.RichTextContentItem[]): Promise<_RichTextContentReturn[] | []> => {
  if (!Array.isArray(content)) {
    return []
  }

  const normalContent = []

  for (let i = 0; i < content.length; i += 1) {
    const c: FRM.RichTextContentItem = content[i]

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

    let contentValue: string | _RichTextContentReturn[] = ''

    if (typeof value === 'string' && value !== '') {
      contentValue = value

      if (marks !== undefined && Array.isArray(marks)) {
        const markTags = marks.map((m) => {
          return _getTag(m.type)
        })

        const markStart = markTags.map(m => `<${m}>`).join('')
        const markEnd = markTags.map(m => `</${m}>`).join('')

        contentValue = `${markStart}${value}${markEnd}`
      }
    }

    if (typeof con === 'string' && con !== '') {
      contentValue = con
    }

    if (Array.isArray(con) && con !== undefined) {
      contentValue = await _normalizeContent(con)
    }

    const richTextNormalizeContentFilterArgs: FRM.RichTextNormalizeContentFilterArgs = {
      type: filterType,
      args: c
    }

    contentValue = await applyFilters('richTextNormalizeContent', contentValue, richTextNormalizeContentFilterArgs)

    /* Link */

    if (data !== undefined && typeof data === 'object') {
      link = data?.uri !== undefined ? data.uri : ''

      if (nodeType === 'entry-hyperlink' && data?.target !== undefined) {
        internalLink = data.target
      }

      if (nodeType === 'asset-hyperlink' && data?.target?.fields?.file?.url !== undefined) {
        const url: string = data.target.fields.file.url

        link = `https:${url}`
      }
    }

    /* Output */

    const obj: _RichTextContentReturn = { tag, content: contentValue }

    if (link !== '') {
      obj.link = link
    }

    if (internalLink !== undefined && typeof internalLink === 'object') {
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
 * @param {object} args
 * @param {array|string} args.content
 * @return {string}
 */

interface _RichTextContentProps {
  content: Array<{
    tag?: string
    link?: string
    internalLink?: FRM.InternalLink
    content?: string | object[]
  }>
  props: FRM.RichTextProps
  _output?: string
}

const _getContent = async ({
  content = [],
  props,
  _output = ''
}: _RichTextContentProps): Promise<string> => {
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

    if (Array.isArray(con)) {
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

    if (typeof cc === 'string') {
      const richTextContentFilterArgs: FRM.RichTextContentFilterArgs = {
        args: c,
        props
      }

      const ccc = await applyFilters('richTextContent', cc, richTextContentFilterArgs)

      if (typeof ccc === 'string') {
        cc = ccc
      }

      outputStr += cc
    }

    if (tag !== '' && outputStr !== '') {
      outputStr = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>${outputStr}</${tag}>`
    }

    const richTextContentOutput: FRM.RichTextContentOutputFilterArgs = {
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
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.type
 * @param {string} props.args.tag
 * @param {string|object[]} props.args.content
 * @param {string} props.args.classes
 * @param {string} props.args.textStyle
 * @param {string} props.args.headingStyle
 * @param {string} props.args.align
 * @param {string} props.args.link
 * @param {object} props.args.internalLink
 * @param {string} props.args.style
 * @param {object[]} props.parents
 * @return {string}
 */

const RichText = async (props: FRM.RichTextProps = { args: {}, parents: [] }): Promise<string> => {
  props = await applyFilters('richTextProps', props, { renderType: 'RichText' })

  const { args = {} } = props

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

  if (type !== '') {
    tag = _getTag(type)
  }

  if (Array.isArray(content)) {
    content = await _normalizeContent(content)
  }

  /* Hr */

  if (tag === 'hr') {
    return '<hr>'
  }

  /* Check if heading */

  const heading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)

  /* Classes */

  const classesArray: string[] = []

  if (classes !== '') {
    classesArray.push(classes)
  }

  if (textStyle !== '') {
    classesArray.push(textStyle)
  }

  if (headingStyle !== '' && heading) {
    classesArray.push(headingStyle)
  }

  if (align !== '') {
    classesArray.push(align)
  }

  /* Generate output */

  let output = ''

  if (Array.isArray(content)) {
    output = await _getContent({
      content,
      props
    })
  } else {
    output = content
  }

  /* Attributes */

  const attrs: string[] = [`data-rich="${tag}"`]

  if (heading && typeof content === 'string') {
    attrs.push(`id="${content.replace(/[\s,:;"'“”‘’]/g, '-').toLowerCase()}"`)
  }

  if (tag === 'a') {
    let anchorLink = link

    if (internalLink !== undefined && internalLink !== null) {
      anchorLink = getLink(internalLink)
    }

    if (anchorLink !== '') {
      attrs.push(`href="${anchorLink}"`)
    }
  }

  if (classesArray.length > 0) {
    attrs.push(`class="${classesArray.join(' ')}"`)
  }

  if (style !== '') {
    attrs.push(`style="${style}"`)
  }

  if (attr !== '') {
    attrs.push(attr)
  }

  /* Output */

  if (tag !== '' && output !== '') {
    output = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>${output}</${tag}>`
  }

  const richTextOutputFilterArgs: FRM.RichTextProps = props

  output = await applyFilters('richTextOutput', output, richTextOutputFilterArgs)

  return output
}

/* Exports */

export { RichText }
