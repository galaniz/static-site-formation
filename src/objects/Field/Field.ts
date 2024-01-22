/**
 * Objects - Field
 */

/* Imports */

import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filters/filters'

/**
 * @typedef {object} FieldProps
 * @prop {object} args
 * @prop {string} [args.type]
 * @prop {string} [args.name]
 * @prop {string} [args.label]
 * @prop {string} [args.value]
 * @prop {boolean} [args.required]
 * @prop {string} [args.width]
 * @prop {string} [args.widthSmall]
 * @prop {string} [args.widthMedium]
 * @prop {string} [args.widthLarge]
 * @prop {boolean} [args.grow]
 * @prop {string} [args.autoCompleteToken]
 * @prop {string} [args.placeholder]
 * @prop {string[]} [args.options]
 * @prop {number} [args.rows]
 * @prop {string} [args.emptyErrorMessage]
 * @prop {string} [args.invalidErrorMessage]
 * @prop {boolean} [args.fieldset]
 * @prop {string} [args.fieldsetClasses] - Back end option
 * @prop {string} [args.fieldClasses] - Back end option
 * @prop {string} [args.labelClasses] - Back end option
 * @prop {string} [args.classes] - Back end option
 * @prop {string} [args.visuallyHiddenClass] - Back end option
 */

export interface FieldProps {
  args: {
    type?: string
    name?: string
    label?: string
    value?: string
    required?: boolean
    width?: string
    widthSmall?: string
    widthMedium?: string
    widthLarge?: string
    grow?: boolean
    autoCompleteToken?: string
    placeholder?: string
    options?: string[]
    rows?: number
    emptyErrorMessage?: string
    invalidErrorMessage?: string
    fieldset?: boolean
    fieldsetClasses?: string
    fieldClasses?: string
    labelClasses?: string
    classes?: string
    visuallyHiddenClass?: string
    [key: string]: unknown
  }
}

/**
 * @private
 * @typedef {object} _FieldOption
 * @prop {string} text
 * @prop {string} value
 * @prop {boolean} [selected]
 */

interface _FieldOption {
  text: string
  value: string
  selected?: boolean
}

/**
 * @private
 * @typedef {object} _FieldCheckboxRadioArgs
 * @prop {_FieldOption[]} [opts]
 * @prop {string} [name]
 * @prop {string} [classes]
 * @prop {string} [attr]
 * @prop {string} [type]
 */

interface _FieldCheckboxRadioArgs {
  opts?: _FieldOption[]
  name?: string
  classes?: string
  attr?: string
  type?: string
  labelClass?: string
}

/**
 * Function - output checkbox and radio inputs from options
 *
 * @private
 * @param {_FieldCheckboxRadioArgs} args
 * @return {string[]}
 */

const _getCheckboxRadioOpts = (args: _FieldCheckboxRadioArgs = {}): string => {
  const {
    opts = [],
    name = '',
    classes = '',
    attr = '',
    type = 'checkbox',
    labelClass = ''
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
        <label for="${id}"${labelClass} data-label>
          <span>${text}</span>
        </label>
      </div>
    `
  }).join('')
}

/**
 * Function - output form field
 *
 * @param {FieldProps} props
 * @return {romise<string>} HTML - div
 */

const Field = async (props: FieldProps = { args: {} }): Promise<string> => {
  props = await applyFilters('fieldProps', props, { renderType: 'Field' })

  const { args = {} } = props

  const {
    type = 'text',
    name = '',
    label = '',
    value = '',
    required = false,
    width = '',
    widthSmall = '',
    widthMedium = '',
    widthLarge = '',
    autoCompleteToken = '',
    placeholder = '',
    options = [],
    rows = 5,
    emptyErrorMessage = '',
    invalidErrorMessage = '',
    fieldsetClasses = '',
    fieldClasses = '',
    labelClasses = '',
    classes = '',
    visuallyHiddenClass = ''
  } = args

  let { fieldset = false } = args

  /* Name and label required */

  if (name === '' || label === '') {
    return ''
  }

  /* Id */

  const id: string = uuid()

  /* Field classes */

  const fieldClassesArray: string[] = []

  if (fieldClasses !== '') {
    fieldClassesArray.push(fieldClasses)
  }

  /* Width */

  if (width !== '') {
    fieldClassesArray.push(width)
  }

  if (widthSmall !== '' && widthSmall !== width) {
    fieldClassesArray.push(widthSmall)
  }

  if (widthMedium !== '' && widthMedium !== widthSmall) {
    fieldClassesArray.push(widthMedium)
  }

  if (widthLarge !== '' && widthLarge !== widthMedium) {
    fieldClassesArray.push(widthLarge)
  }

  /* Classes */

  const classesArray: string[] = []

  if (classes !== '') {
    classesArray.push(classes)
  }

  /* Checkbox or radio */

  const checkboxRadio = type === 'checkbox' || type === 'radio'

  /* Options */

  const opts: _FieldOption[] = []

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
  const labelClass = labelClasses !== '' ? ` class="${labelClasses}"` : ''

  if (checkboxRadio) {
    labelAfter = `
      <label for="${id}">
        <span${labelClass} data-label>
          <span>${label}</span>
        </span>
        <span data-control data-type="${type}"></span>
      </label>
    `

    if (fieldset) {
      labelBefore = `
        <legend${labelRequired}>
          <span>${label}${required ? `<span${visuallyHiddenClass !== '' ? ` class="${visuallyHiddenClass}"` : ''}> required</span>` : ''}
            ${labelRequiredIcon}
          </span>
        </legend>
      `
    }
  } else {
    labelBefore = `
      <label for="${id}"${labelClass} data-label${labelRequired}>
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
      input = `<input type="${type}" name="${name}" id="${id}" class="${classesArray.join(' ')}"${attrs}>`

      if (checkboxRadioOpts) {
        input = _getCheckboxRadioOpts({
          opts,
          name,
          classes,
          attr: attrs,
          type,
          labelClass
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
      ${fieldset ? `<fieldset${fieldsetClasses !== '' ? ` class="${fieldsetClasses}"` : ''}>` : ''}
      ${labelBefore}
      ${input}
      ${labelAfter}
      ${fieldset ? '</fieldset>' : ''}
    </div>
  `
}

/* Exports */

export { Field }
