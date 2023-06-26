/**
 * Render - form
 */

/* Imports */

import { v4 as uuid } from 'uuid'
import { config } from '../../config'
import { applyFilters } from '../../utils/filters'
import isString from '../../utils/is-string'

/**
 * Function - output form wrapper
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.id
 * @param {string} props.args.action
 * @param {string} props.args.subject
 * @param {string} props.args.toEmail
 * @param {string} props.args.senderEmail
 * @param {string} props.args.submitLabel
 * @param {string} props.args.successTitle
 * @param {string} props.args.successText
 * @param {string} props.args.errorTitle
 * @param {string} props.args.errorText
 * @param {boolean} props.args.wrap
 * @param {string} props.args.rowBreakpoint
 * @param {string} props.args.alignBreakpoint
 * @return {object}
 */

interface Props {
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
  }
}

const form = (props: Props = { args: {} }): Formation.Return => {
  props = applyFilters('formProps', props, ['form'])

  const { args = {} } = props

  const {
    id = '',
    action = 'send-form',
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

  if (id === '') {
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

  if (config.script[`form-${id}`] === undefined && (successTitle !== '' || errorTitle !== '')) {
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

    config.script[`form-${id}`] = messages
  }

  config.script.sendUrl = '/ajax/'

  /* Honeypot */

  const honeypotId: string = uuid()
  const honeypotName = `${config.namespace}_asi`
  const honeypot = `
    <div${isString(honeypotFieldClasses) ? ` class="${honeypotFieldClasses}"` : ''} data-asi>
      <label${isString(honeypotLabelClasses) ? ` class="${honeypotLabelClasses}"` : ''} for="${honeypotId}">Website</label>
      <input${isString(honeypotClasses) ? ` class="${honeypotClasses}"` : ''} type="url" name="${honeypotName}" id="${honeypotId}" autocomplete="off">
    </div>
  `

  /* Output */

  const start = `
    <form${isString(formClasses) ? ` class="${formClasses}"` : ''} id="${id}" data-action="${action}"${isString(formAttr) ? ` ${formAttr}` : ''} novalidate>
      <div${isString(fieldsClasses) ? ` class="${fieldsClasses}"` : ''}${isString(fieldsAttr) ? ` ${fieldsAttr}` : ''}>
        ${errorSummary}
  `

  const end = `
        ${honeypot}
        ${errorResult}
        <div${isString(submitFieldClasses) ? ` class="${submitFieldClasses}"` : ''} data-type="submit">
          <button${isString(submitClasses) ? ` class="${submitClasses}"` : ''}${isString(submitAttr) ? ` ${submitAttr}` : ''} type="submit">
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

export default form
