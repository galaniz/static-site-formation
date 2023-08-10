/**
 * Render - form
 */

/* Imports */

import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filters'
import config from '../../config'

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

const form = async (props: FRM.FormProps = { args: {} }): Promise<FRM.StartEndReturn> => {
  props = await applyFilters('formProps', props, { renderType: 'form' })

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

export default form
