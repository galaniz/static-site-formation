/**
 * Serverless - send form
 */

/* Imports */

import escape from 'validator/es/lib/escape'
import { getPermalink } from '../utils'
import { enumSite } from '../vars/enums'
import { envData } from '../vars/data'

/**
 * Function - recurse through data to output plain and html email body
 *
 * @private
 * @param {object} data
 * @param {object} output
 * @param {number} depth
 */

const _recurseEmailHtml = (data = {}, output = {}, depth = 1) => {
  const isArray = Array.isArray(data)

  Object.keys(data).forEach((label) => {
    const value = data[label]
    const h = depth + 1

    if (depth === 1) {
      output.html += `
        <tr>
          <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
      `
    }

    if (label && !isArray) {
      output.html += `
        <h${h} style='font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em'>
          ${label}
        </h${h}>
      `

      output.plain += `${label}\n`
    }

    if (typeof value === 'object') {
      _recurseEmailHtml(value, output, depth + 1)
    } else {
      output.html += `
        <p style='font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;'>
          ${value}
        </p>
      `

      output.plain += value.replace(/(<([^>]+)>)/ig, '') + '\n'
    }

    if (depth === 1) {
      output.html += `
          </td>
        </tr>
      `

      output.plain += '\n'
    }
  })
}

/**
 * Function - generate email from form fields and send with Smtp2go
 *
 * @param {object} args
 * @param {string} args.id
 * @param {array<object>} args.inputs
 * @return {object}
 */

const sendForm = async ({ id, inputs }) => {
  /* Meta information - to email and subject */

  const formMeta = require('../json/form-meta.json')
  const meta = formMeta[id]

  /* To email */

  let toEmail = meta?.toEmail

  if (!toEmail) {
    return {
      error: {
        message: 'No to email'
      }
    }
  }

  toEmail = toEmail.split(',')

  /* Sender email */

  const senderEmail = meta?.senderEmail

  if (!senderEmail) {
    return {
      error: {
        message: 'No sender email'
      }
    }
  }

  /* Subject */

  let subject = meta?.subject || ''

  /* Reply to email */

  let replyToEmail = ''

  /* Email content */

  const header = `${enumSite.title} contact form submission`
  const footer = `This email was sent from a contact form on ${enumSite.title} (${getPermalink()})`
  const outputData = {}
  const output = {
    html: '',
    plain: ''
  }

  Object.keys(inputs).forEach((name) => {
    const input = inputs[name]
    const inputType = input.type
    const inputLabel = input.label.trim()

    let inputValue = input.value

    /* Escape value */

    if (Array.isArray(inputValue)) {
      inputValue = inputValue.map(v => escape(v + ''))
      inputValue = inputValue.join('<br>')
    } else {
      inputValue = escape(input.value + '')
    }

    /* Subject */

    if (name === 'subject' && inputValue) {
      subject = `${subject} - ${inputValue}`
      return
    }

    /* Reply to email */

    if (inputType === 'email' && inputValue) {
      replyToEmail = inputValue
      inputValue = `<a href='mailto:${inputValue}'>${inputValue}</a>`
    }

    /* Legend */

    let legend = ''

    if (input?.legend) {
      legend = input.legend

      if (!outputData?.[legend]) {
        outputData[legend] = {}
      }
    }

    /* Label */

    if (!outputData?.[inputLabel]) {
      if (legend) {
        outputData[legend][inputLabel] = []
      } else {
        outputData[inputLabel] = []
      }
    }

    /* Output value */

    const outputValue = inputValue || '--'

    if (legend) {
      outputData[legend][inputLabel].push(outputValue)
    } else {
      outputData[inputLabel].push(outputValue)
    }
  })

  _recurseEmailHtml(outputData, output)

  const outputHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" width="100%" style="padding: 0 16px 16px 16px;">
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-right: auto; margin-left: auto; border-spacing: 0; max-width: 37.5em;">
            <tr>
              <td style="padding: 32px 0 0 0;">
                <h1 style='font-family: sans-serif; color: #222; margin: 0; line-height: 1.3em;'>
                  ${header}
                </h1>
              </td>
            </tr>
            <tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  ${output.html}
                  <tr>
                    <td style="padding: 32px 0;">
                      <p style='font-family: sans-serif; color: #222; margin: 0; line-height: 1.5em;'>
                        ${footer}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  const outputPlain = `
    ${header}\n\n
    ${output.plain}
    ${footer}
  `

  /* Subjext fallback */

  if (!subject) {
    subject = `${enumSite.title} Contact Form`
  }

  /* Smtp2go request */

  const body = {
    api_key: envData.smtp2go.apiKey,
    to: toEmail,
    sender: senderEmail,
    subject,
    text_body: outputPlain,
    html_body: outputHtml
  }

  if (replyToEmail) {
    body.custom_headers = [
      {
        header: 'Reply-To',
        value: `<${replyToEmail}>`
      }
    ]
  }

  const res = await fetch(
    'https://api.smtp2go.com/v3/email/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )

  const resJson = await res.json()

  /* Success */

  if (resJson?.data?.succeeded) {
    return {
      success: {
        message: 'Form successully sent'
      }
    }
  } else {
    return {
      error: {
        message: 'Error sending email'
      }
    }
  }
}

/* Exports */

export default sendForm
