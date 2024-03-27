/**
 * Text - Rich Text
 */

/* Imports */

import type {
  RichTextProps,
  RichTextContentProps,
  RichTextContentFilterArgs
} from './RichTextTypes'
import { getLink } from '../../utils/getLink/getLink'
import { getExcerpt } from '../../utils/getExcerpt/getExcerpt'
import { applyFilters } from '../../utils/filters/filters'
import { isString, isStringStrict } from '../../utils/isString/isString'
import { isArray, isArrayStrict } from '../../utils/isArray/isArray'
import { isObjectStrict } from '../../utils/isObject/isObject'
import { isHeading } from '../../utils/isHeading/isHeading'

/**
 * Function - check if string contains shortcode
 *
 * @private
 * @param {string} tag
 * @param {string} content
 * @return {boolean}
 */
const _containsShortcode = (tag: string = '', content: string = ''): boolean => {
  if (tag === 'p' && content.charAt(0) === '[' && content.charAt(content.length - 1) === ']') {
    return true
  }

  return false
}

/**
 * Function - recursively output content
 *
 * @private
 * @param {import('./RichTextTypes').RichTextContentProps} args
 * @return {Promise<string>}
 */
const _getContent = async (args: RichTextContentProps): Promise<string> => {
  const {
    content = [],
    props,
    dataAttr = false
  } = args

  let {
    _output = ''
  } = args

  for (let i = 0; i < content.length; i += 1) {
    const item = content[i]

    const {
      link = '',
      internalLink,
      content: c
    } = item

    let {
      tag = ''
    } = item

    let cc = c

    /* Nested content */

    if (isArrayStrict(c)) {
      cc = await _getContent({
        content: c,
        props,
        dataAttr
      })
    }

    /* Attributes */

    const attrs: string[] = []

    if (dataAttr) {
      attrs.push(`data-rich="${tag}"`)
    }

    /* Link */

    if (tag === 'a') {
      let anchorLink = link

      if (internalLink !== undefined) {
        anchorLink = getLink(internalLink)
      }

      if (anchorLink !== '') {
        attrs.push(`href="${anchorLink}"`)
      }
    }

    /* Filter output */

    let outputStr = ''

    if (isString(cc)) {
      const richTextContentFilterArgs: RichTextContentFilterArgs = {
        args: item,
        props
      }

      const ccc = await applyFilters('richTextContent', cc, richTextContentFilterArgs)

      if (isString(ccc)) {
        cc = ccc
      }

      outputStr += cc
    }

    if (_containsShortcode(tag, outputStr)) {
      tag = ''
    }

    /* Output */

    if (isStringStrict(tag) && outputStr.trim() !== '') {
      outputStr = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>${outputStr}</${tag}>`
    }

    const richTextContentOutput: RichTextContentFilterArgs = {
      args: item,
      props
    }

    outputStr = await applyFilters('richTextContentOutput', outputStr, richTextContentOutput)

    _output += outputStr
  }

  /* Output */

  return _output
}

/**
 * Function - output rich text
 *
 * @param {import('./RichTextTypes').RichTextProps} props
 * @return {Promise<string>}
 */
const RichText = async (props: RichTextProps): Promise<string> => {
  /* Props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  props = await applyFilters('richTextProps', props, { renderType: 'richText' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  let { args } = props

  args = isObjectStrict(args) ? args : {}

  const {
    content = [],
    classes = '',
    link = '',
    internalLink,
    textStyle = '',
    headingStyle = '',
    align = '',
    style = '',
    attr = '',
    dataAttr = true
  } = args

  let {
    tag = ''
  } = args

  /* Hr */

  if (tag === 'hr') {
    return '<hr>'
  }

  /* Check if heading */

  const isSectionHeading = isHeading(tag)

  /* Classes */

  const classesArr: string[] = []

  if (isStringStrict(classes)) {
    classesArr.push(classes)
  }

  if (isStringStrict(textStyle)) {
    classesArr.push(textStyle)
  }

  if (isStringStrict(headingStyle) && isSectionHeading) {
    classesArr.push(headingStyle)
  }

  if (isStringStrict(align)) {
    classesArr.push(align)
  }

  /* Generate output */

  let output = ''
  let headingStr = ''
  let headingObj

  if (isStringStrict(content)) {
    output = content
    headingStr = content
  }

  if (isArrayStrict(content)) {
    headingObj = content

    output = await _getContent({
      content,
      props,
      dataAttr
    })
  }

  /* Attributes */

  const attrs: string[] = []

  if (dataAttr) {
    attrs.push(`data-rich="${tag}"`)
  }

  if (isSectionHeading) {
    const headingContents = getExcerpt({
      limit: 10,
      limitExcerpt: true,
      excerpt: headingStr,
      content: headingObj
    })

    const id = headingContents
      .trim()
      .replace('&hellip;', '')
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()

    if (headingContents !== '' && id !== '') {
      attrs.push(`id=${id}`)

      if (isArray(props.headings)) {
        props.headings.push({
          id,
          title: headingContents,
          type: tag
        })
      }
    }
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

  if (classesArr.length > 0) {
    attrs.push(`class="${classesArr.join(' ')}"`)
  }

  if (isStringStrict(style)) {
    attrs.push(`style="${style}"`)
  }

  if (isStringStrict(attr)) {
    attrs.push(attr)
  }

  /* Output */

  if (_containsShortcode(tag, output)) {
    tag = ''
  }

  if (tag !== '' && output.trim() !== '') {
    output = `<${tag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>${output}</${tag}>`
  }

  output = await applyFilters('richTextOutput', output, props)

  return output
}

/* Exports */

export { RichText }
