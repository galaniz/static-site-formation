/**
 * Objects - Field
 */

/* Imports */

import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filters/filters'

/**
 * Function - output checkbox and radio inputs from options
 *
 * @private
 * @param {object} args
 * @param {object[]} args.opts
 * @param {string} args.name
 * @param {string} args.classes
 * @param {string} args.attr
 * @param {string} args.type
 * @return {string[]}
 */

interface _FieldOption {
  text: string
  value: string
  selected?: boolean
}

interface _FieldCheckboxRadioArgs {
  opts?: _FieldOption[]
  name?: string
  classes?: string
  attr?: string
  type?: string
  labelClass?: string
}

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
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.type
 * @param {string} props.args.name
 * @param {string} props.args.label
 * @param {string} props.args.value
 * @param {boolean} props.args.required
 * @param {string} props.args.width
 * @param {string} props.args.widthLarge
 * @param {boolean} props.args.grow
 * @param {string} props.args.autoCompleteToken
 * @param {string} props.args.placeholder
 * @param {string[]} props.args.options
 * @param {number} props.args.rows
 * @param {string} props.args.emptyErrorMessage
 * @param {string} props.args.invalidErrorMessage
 * @param {boolean} props.args.fieldset
 * @param {string} props.args.fieldsetClasses - Back end option
 * @param {string} props.args.fieldClasses - Back end option
 * @param {string} props.args.labelClasses - Back end option
 * @param {string} props.args.classes - Back end option
 * @param {string} props.args.visuallyHiddenClass - Back end option
 * @return {string} HTML - div
 */

const Field = async (props: FRM.FieldProps = { args: {} }): Promise<string> => {
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
