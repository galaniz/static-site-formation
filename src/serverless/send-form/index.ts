/**
 * Serverless - send form
 */

/* Imports */

import escape from 'validator/es/lib/escape'
import { config } from '../../config'
import getPermalink from '../../utils/get-permalink'
import requireFile from '../../utils/require-file'

/**
 * Function - recurse through data to output plain and html email body
 *
 * @private
 * @param {object} data
 * @param {object} output
 * @param {number} depth
 * @return {void}
 */

const _recurseEmailHtml = (data: object, output: { html: string, plain: string }, depth: number = 1): void => {
  const isArray = Array.isArray(data)

  Object.keys(data).forEach((label: string) => {
    const value: string = data[label]
    const h = depth + 1

    if (depth === 1) {
      output.html += `
        <tr>
          <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
      `
    }

    if (label !== '' && !isArray) {
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

interface SendFormBody {
  api_key: string
  to: string[]
  sender: string
  subject: string
  text_body: string
  html_body: string
  custom_headers?: any[]
}

const sendForm = async ({ id, inputs }: Formation.AjaxActionArgs): Promise<Formation.AjaxActionReturn> => {
  /* Id required */

  if (id === undefined || id === '') {
    return {
      error: {
        message: 'No id'
      }
    }
  }

  /* Meta information - to email and subject */

  const formMeta = requireFile(`${config.store.dir}${config.store.files.formMeta.name}`)
  const meta = formMeta[id]

  /* To email */

  const toEmail: string = meta?.toEmail

  if (toEmail === undefined || toEmail === '') {
    return {
      error: {
        message: 'No to email'
      }
    }
  }

  const toEmails: string[] = toEmail.split(',')

  /* Sender email */

  const senderEmail = meta?.senderEmail

  if (senderEmail === undefined || senderEmail === '') {
    return {
      error: {
        message: 'No sender email'
      }
    }
  }

  /* Subject */

  let subject = meta?.subject !== undefined ? meta.subject : ''

  /* Reply to email */

  let replyToEmail = ''

  /* Email content */

  const header = `${config.title} contact form submission`
  const footer = `This email was sent from a contact form on ${config.title} (${getPermalink()})`
  const outputData = {}
  const output = {
    html: '',
    plain: ''
  }

  Object.keys(inputs).forEach((name) => {
    const input = inputs[name]
    const inputType = input.type
    const inputLabel = input.label.trim()
    const inputValue = input.value

    /* Escape value */

    let inputValueStr = ''

    if (Array.isArray(inputValue)) {
      inputValueStr = inputValue.map(v => escape(v + '')).join('<br>')
    }

    if (typeof inputValue === 'string') {
      inputValueStr = escape(inputValue + '')
    }

    /* Subject */

    if (name === 'subject' && inputValueStr !== '') {
      subject = `${typeof subject === 'string' && subject !== '' ? `${subject} - ` : ''}${inputValueStr}`
      return
    }

    /* Reply to email */

    if (inputType === 'email' && inputValueStr !== '') {
      replyToEmail = inputValueStr
      inputValueStr = `<a href='mailto:${inputValueStr}'>${inputValueStr}</a>`
    }

    /* Legend */

    let legend = ''

    if (input?.legend !== undefined) {
      legend = input.legend

      if (outputData?.[legend] === undefined) {
        outputData[legend] = {}
      }
    }

    /* Label */

    if (outputData?.[inputLabel] === undefined) {
      if (legend !== '') {
        outputData[legend][inputLabel] = []
      } else {
        outputData[inputLabel] = []
      }
    }

    /* Output value */

    const outputValue = inputValueStr === '' ? '--' : inputValueStr

    if (legend !== '') {
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

  if (subject === '') {
    subject = `${config.title} Contact Form`
  }

  /* Smtp2go request */

  const body: SendFormBody = {
    api_key: config.apiKeys.smtp2go,
    to: toEmails,
    sender: senderEmail,
    subject,
    text_body: outputPlain,
    html_body: outputHtml
  }

  if (replyToEmail !== '') {
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

  if (resJson?.data?.succeeded !== undefined) {
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