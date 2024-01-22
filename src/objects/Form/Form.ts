/**
 * Objects - Form
 */

/* Imports */

import { v4 as uuid } from 'uuid'
import { applyFilters, isStringStrict } from '../../utils'
import { config } from '../../config/config'

/**
 * @typedef {object} FormProps
 * @prop {object} args
 * @prop {string} [args.id]
 * @prop {string} [args.action]
 * @prop {string} [args.subject]
 * @prop {string} [args.toEmail]
 * @prop {string} [args.senderEmail]
 * @prop {string} [args.submitLabel]
 * @prop {string} [args.successTitle]
 * @prop {string} [args.successText]
 * @prop {string} [args.successResult]
 * @prop {string} [args.errorTitle]
 * @prop {string} [args.errorText]
 * @prop {string} [args.errorSummary]
 * @prop {string} [args.errorResult]
 * @prop {string} [args.formClasses]
 * @prop {string} [args.formAttr]
 * @prop {string} [args.fieldsClasses]
 * @prop {string} [args.fieldsAttr]
 * @prop {string} [args.submitFieldClasses]
 * @prop {string} [args.submitClasses]
 * @prop {string} [args.submitAttr]
 * @prop {string} [args.submitLoader]
 * @prop {string} [args.honeypotFieldClasses]
 * @prop {string} [args.honeypotLabelClasses]
 * @prop {string} [args.honeypotClasses]
 */
export interface FormProps {
  args: {
    id?: string
    action?: string
    subject?: string
    toEmail?: string
    senderEmail?: string
    submitLabel?: string
    successTitle?: string
    successText?: string
    successResult?: string
    errorTitle?: string
    errorText?: string
    errorSummary?: string
    errorResult?: string
    formClasses?: string
    formAttr?: string
    fieldsClasses?: string
    fieldsAttr?: string
    submitFieldClasses?: string
    submitClasses?: string
    submitAttr?: string
    submitLoader?: string
    honeypotFieldClasses?: string
    honeypotLabelClasses?: string
    honeypotClasses?: string
    [key: string]: unknown
  }
}

/**
 * @typedef {object} FormReturn
 * @prop {string} start
 * @prop {string} end
 */
interface FormReturn {
  start: string
  end: string
}

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

  if (subject !== '' || toEmail !== '' || senderEmail !== '') {
    const meta: { subject?: string, toEmail?: string, senderEmail?: string } = {}

    if (subject !== '') {
      meta.subject = subject
    }

    if (toEmail !== '') {
      meta.toEmail = toEmail
    }

    if (senderEmail !== '') {
      meta.senderEmail = senderEmail
    }

    config.formMeta[id] = meta
  }

  /* Add to script data */

  if (config.scriptMeta[`form-${id}`] === undefined && (successTitle !== '' || errorTitle !== '')) {
    const messages: { successMessage?: object, errorMessage?: object } = {}

    if (successTitle !== '') {
      messages.successMessage = {
        primary: successTitle,
        secondary: successText
      }
    }

    if (errorTitle !== '') {
      messages.errorMessage = {
        primary: errorTitle,
        secondary: errorText
      }
    }

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
