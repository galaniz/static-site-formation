/**
 * Render - field
 */

/* Imports */

import { v4 as uuid } from 'uuid'

/**
 * Function - output checkbox and radio inputs from options
 *
 * @private
 * @param {object} args
 * @param {array<object>} args.opts
 * @param {string} args.name
 * @param {string} args.classes
 * @param {string} args.attr
 * @param {string} args.type
 * @return {array<string>}
 */

interface _Opt {
  text: string
  value: string
  selected?: boolean
}

interface _Args {
  opts?: _Opt[]
  name?: string
  classes?: string
  attr?: string
  type?: string
}

const _getCheckboxRadioOpts = (args: _Args = {}): string => {
  const {
    opts = [],
    name = '',
    classes = '',
    attr = '',
    type = 'checkbox'
  } = args

  /* Opts and name required */

  if (opts.length === 0 || name === '') {
    return ''
  }

  /* Output */

  return opts.map((opt) => {
    const {
      text = '',
      value = '',
      selected = false
    } = opt

    const id: string = uuid()

    return `
      <div data-${type}-opt>
        <input type="${type}" name="${name}" id="${id}" class="${classes}" value="${value}"${attr}${selected ? ' checked' : ''}>
        <label for="${id}" class="o-form__label" data-label>
          <span>${text}</span>
        </label>
      </div>
    `
  }).join('')
}

/**
 * Function - output form field
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.type
 * @param {string} props.args.name
 * @param {string} props.args.label
 * @param {string} props.args.value
 * @param {boolean} props.args.required
 * @param {string} props.args.width
 * @param {string} props.args.widthBreakpoint
 * @param {boolean} props.args.grow
 * @param {string} props.args.autoCompleteToken
 * @param {string} props.args.placeholder
 * @param {array<string>} props.args.options
 * @param {number} props.args.rows
 * @param {string} props.args.emptyErrorMessage
 * @param {string} props.args.invalidErrorMessage
 * @param {string} props.args.fieldClasses
 * @param {string} props.args.classes
 * @param {boolean} props.args.fieldset
 * @return {string} HTML - div
 */

interface Props {
  args: {
    type?: string
    name?: string
    label?: string
    value?: string
    required?: boolean
    width?: string
    widthBreakpoint?: string
    grow?: boolean
    autoCompleteToken?: string
    placeholder?: string
    options?: string[]
    rows?: number
    emptyErrorMessage?: string
    invalidErrorMessage?: string
    fieldClasses?: string
    classes?: string
    fieldset?: boolean
  }
}

const field = (props: Props = { args: {} }): string => {
  const { args = {} } = props

  const {
    type = 'text',
    name = '',
    label = '',
    value = '',
    required = false,
    width = '1-1',
    widthBreakpoint = 'm',
    grow = false,
    autoCompleteToken = '',
    placeholder = '',
    options = [],
    rows = 5,
    emptyErrorMessage = '',
    invalidErrorMessage = '',
    fieldClasses = '',
    classes = ''
  } = args

  let {
    fieldset = false
  } = args

  /* Name and label required */

  if (name === '' || label === '') {
    return ''
  }

  /* Id */

  const id: string = uuid()

  /* Classes */

  const fieldClassesArray = [`o-form__field l-width-1-1 l-width-${width}-${widthBreakpoint}`]
  const classesArray = ['js-input']

  if (fieldClasses !== '') {
    fieldClassesArray.push(fieldClasses)
  }

  if (grow) {
    fieldClassesArray.push('l-flex-grow-1')
  }

  if (classes !== '') {
    classesArray.push(classes)
  }

  /* Checkbox or radio */

  const checkboxRadio = type === 'checkbox' || type === 'radio'

  /* Options */

  const opts: _Opt[] = []

  if (options.length > 0) {
    options.forEach((option) => {
      const data = option.split(' : ')

      if (data.length >= 2) {
        opts.push({
          text: data[0],
          value: data[1],
          selected: data.length === 3
        })
      }
    })
  }

  /* Check if fieldset */

  let checkboxRadioOpts = false

  if (opts.length > 0 && checkboxRadio) {
    checkboxRadioOpts = true
    fieldset = true
  }

  /* Attributes */

  const attr: string[] = []

  if (required) {
    attr.push('aria-required="true"')
  }

  if (value !== '' && !checkboxRadioOpts) {
    attr.push(`value="${value}"`)
  }

  if (placeholder !== '') {
    attr.push(`placeholder="${placeholder}"`)
  }

  if (autoCompleteToken !== '') {
    attr.push(`autocomplete="${autoCompleteToken}"`)
  }

  if (emptyErrorMessage !== '') {
    attr.push(`data-empty-message="${emptyErrorMessage}"`)
  }

  if (invalidErrorMessage !== '') {
    attr.push(`data-invalid-message="${invalidErrorMessage}"`)
  }

  if (rows !== 0 && type === 'textarea') {
    attr.push(`rows="${rows}"`)
  }

  let attrs = ''

  if (attr.length > 0) {
    attrs = ` ${attr.join(' ')}`
  }

  /* Label */

  let labelBefore = ''
  let labelAfter = ''

  const labelRequired = required ? ' data-required' : ''
  const labelRequiredIcon = required ? '<span data-required-icon aria-hidden="true"></span>' : ''

  if (checkboxRadio) {
    labelAfter = `
      <label for="${id}">
        <span class="o-form__label" data-label>
          <span>${label}</span>
        </span>
        <span data-control data-type="${type}"></span>
      </label>
    `

    if (fieldset) {
      labelBefore = `
        <legend${labelRequired}>
          <span>${label}${required ? '<span class="a11y-visually-hidden"> required</span>' : ''}
            ${labelRequiredIcon}
          </span>
        </legend>
      `
    }
  } else {
    labelBefore = `
      <label for="${id}" class="o-form__label" data-label${labelRequired}>
        <span>
          ${label}
          ${labelRequiredIcon}
        </span>
      </label>
    `
  }

  /* Input */

  let input = ''

  switch (type) {
    case 'text':
    case 'email':
    case 'checkbox':
    case 'radio':
    case 'number':
    case 'password':
    case 'tel': {
      if (checkboxRadio) {
        classesArray.push('a11y-hide-input')
      }

      input = `<input type="${type}" name="${name}" id="${id}" class="${classesArray.join(' ')}"${attrs}>`

      if (checkboxRadioOpts) {
        input = _getCheckboxRadioOpts({
          opts,
          name,
          classes,
          attr: attrs,
          type
        })
      }

      break
    }
    case 'textarea': {
      input = `<textarea name="${name}" id="${id}" class="${classesArray.join(' ')}"${attrs}></textarea>`
      break
    }
    case 'select': {
      if (opts.length > 0) {
        const optsOutput = opts.map((opt) => {
          const {
            text,
            value,
            selected = false
          } = opt

          return `<option value="${value}"${selected ? ' selected' : ''}>${text}</option>`
        }).join('')

        input = `
          <div data-type="select">
            <select name="${name}" id="${id}" class="${classesArray.join(' ')}"${attrs}>${optsOutput}</select>
            <div data-select-arrow></div>
          </div>
        `
      }

      break
    }
  }

  if (input === '') {
    return ''
  }

  /* Output */

  return `
    <div class="${fieldClassesArray.join(' ')}" data-type="${type}">
      ${fieldset ? '<fieldset class="o-field__group">' : ''}
      ${labelBefore}
      ${input}
      ${labelAfter}
      ${fieldset ? '</fieldset>' : ''}
    </div>
  `
}

/* Exports */

export default field
