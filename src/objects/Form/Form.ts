/**
 * Objects - Form
 */

/* Imports */

import type { FormProps, FormReturn, FormMeta, FormMessages } from './FormTypes'
import { v4 as uuid } from 'uuid'
import { applyFilters, isStringStrict } from '../../utils'
import { config } from '../../config/config'

/**
 * Function - output form wrapper
 *
 * @param {FormProps} props
 * @return {Promise<FormReturn>}
 */
const Form = async (props: FormProps = { args: {} }): Promise<FormReturn> => {
  props = await applyFilters('formProps', props, { renderType: 'Form' })

  const { args = {} } = props

  const {
    id = '',
    action = 'sendForm',
    subject = '',
    toEmail = '',
    senderEmail = '',
    submitLabel = 'Send',
    successTitle = '',
    successText = '',
    errorTitle = '',
    errorText = '',
    errorSummary = '',
    errorResult = '',
    successResult = '',
    formClasses = '',
    formAttr = '',
    fieldsClasses = '',
    fieldsAttr = '',
    submitFieldClasses = '',
    submitClasses = '',
    submitAttr = '',
    submitLoader = '',
    honeypotFieldClasses = '',
    honeypotLabelClasses = '',
    honeypotClasses = ''
  } = args

  /* Id required */

  if (!isStringStrict(id)) {
    return {
      start: '',
      end: ''
    }
  }

  /* Add to form meta data */

  const meta: FormMeta = {}

  if (isStringStrict(subject)) {
    meta.subject = subject
  }

  if (isStringStrict(toEmail)) {
    meta.toEmail = toEmail
  }

  if (isStringStrict(senderEmail)) {
    meta.senderEmail = senderEmail
  }

  if (Object.keys(meta).length > 0) {
    config.formMeta[id] = meta
  }

  /* Add to script data */

  const messages: FormMessages = {}

  if (isStringStrict(successTitle)) {
    messages.successMessage = {
      primary: successTitle,
      secondary: successText
    }
  }

  if (isStringStrict(errorTitle)) {
    messages.errorMessage = {
      primary: errorTitle,
      secondary: errorText
    }
  }

  if (Object.keys(messages).length > 0 && config.scriptMeta[`form-${id}`] === undefined) {
    config.scriptMeta[`form-${id}`] = messages
  }

  config.scriptMeta.sendUrl = '/ajax/'

  /* Honeypot */

  const honeypotId: string = uuid()
  const honeypotName = `${config.namespace}_asi`
  const honeypot = `
    <div${honeypotFieldClasses !== '' ? ` class="${honeypotFieldClasses}"` : ''} data-asi>
      <label${honeypotLabelClasses !== '' ? ` class="${honeypotLabelClasses}"` : ''} for="${honeypotId}">Website</label>
      <input${honeypotClasses !== '' ? ` class="${honeypotClasses}"` : ''} type="url" name="${honeypotName}" id="${honeypotId}" autocomplete="off">
    </div>
  `

  /* Output */

  const start = `
    <form${formClasses !== '' ? ` class="${formClasses}"` : ''} id="${id}" data-action="${action}"${formAttr !== '' ? ` ${formAttr}` : ''} novalidate>
      <div${fieldsClasses !== '' ? ` class="${fieldsClasses}"` : ''}${fieldsAttr !== '' ? ` ${fieldsAttr}` : ''}>
        ${errorSummary}
  `

  const end = `
        ${honeypot}
        ${errorResult}
        <div${submitFieldClasses !== '' ? ` class="${submitFieldClasses}"` : ''} data-type="submit">
          <button${submitClasses !== '' ? ` class="${submitClasses}"` : ''}${submitAttr !== '' ? ` ${submitAttr}` : ''} type="submit">
            ${submitLoader}
            <span>${submitLabel}</span>
          </button>
        </div>
        ${successResult}
      </div>
    </form>
  `

  return {
    start,
    end
  }
}

/* Exports */

export { Form }
