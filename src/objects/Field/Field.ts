/**
 * Objects - Field
 */

/* Imports */

import type { FieldProps, FieldOption, FieldCheckboxRadioArgs } from './FieldTypes'
import { v4 as uuid } from 'uuid'
import { applyFilters, isStringStrict, isObjectStrict, isArrayStrict } from '../../utils'

/**
 * Function - output checkbox and radio inputs from options
 *
 * @private
 * @param {FieldCheckboxRadioArgs} args
 * @return {string[]}
 */
const _getCheckboxRadioOpts = (args: FieldCheckboxRadioArgs = {}): string => {
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
 * @return {Promise<string>} HTML - div
 */
const Field = async (props: FieldProps = { args: {} }): Promise<string> => {
  /* Props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  props = await applyFilters('fieldProps', props, { renderType: 'Field' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  let { args } = props

  args = isObjectStrict(args) ? args : {}

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

  if (!isStringStrict(name) || !isStringStrict(label)) {
    return ''
  }

  /* Id */

  const id: string = uuid()

  /* Field classes */

  const fieldClassesArray: string[] = []

  if (isStringStrict(fieldClasses)) {
    fieldClassesArray.push(fieldClasses)
  }

  /* Width */

  if (isStringStrict(width)) {
    fieldClassesArray.push(width)
  }

  if (isStringStrict(widthSmall) && widthSmall !== width) {
    fieldClassesArray.push(widthSmall)
  }

  if (isStringStrict(widthMedium) && widthMedium !== widthSmall) {
    fieldClassesArray.push(widthMedium)
  }

  if (isStringStrict(widthLarge) && widthLarge !== widthMedium) {
    fieldClassesArray.push(widthLarge)
  }

  /* Classes */

  const classesArray: string[] = []

  if (isStringStrict(classes)) {
    classesArray.push(classes)
  }

  /* Checkbox or radio */

  const checkboxRadio = type === 'checkbox' || type === 'radio'

  /* Options */

  const opts: FieldOption[] = []

  if (isArrayStrict(options)) {
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

  if (isStringStrict(value) && !checkboxRadioOpts) {
    attr.push(`value="${value}"`)
  }

  if (isStringStrict(placeholder)) {
    attr.push(`placeholder="${placeholder}"`)
  }

  if (isStringStrict(autoCompleteToken)) {
    attr.push(`autocomplete="${autoCompleteToken}"`)
  }

  if (isStringStrict(emptyErrorMessage)) {
    attr.push(`data-empty-message="${emptyErrorMessage}"`)
  }

  if (isStringStrict(invalidErrorMessage)) {
    attr.push(`data-invalid-message="${invalidErrorMessage}"`)
  }

  if (rows > 0 && type === 'textarea') {
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
      ${fieldset ? `<fieldset${isStringStrict(fieldsetClasses) ? ` class="${fieldsetClasses}"` : ''}>` : ''}
      ${labelBefore}
      ${input}
      ${labelAfter}
      ${fieldset ? '</fieldset>' : ''}
    </div>
  `
}

/* Exports */

export { Field }
