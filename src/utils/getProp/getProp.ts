/**
 * Utils - Get Prop
 */

/* Imports */

import type { Prop } from './getPropTypes'
import { config } from '../../config/config'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isNumber } from '../isNumber/isNumber'
import { isArrayStrict } from '../isArray/isArray'

/**
 * Easier access to id, renderType, contentType, fields, file and tag info
 *
 * @type {import('./getPropTypes').Prop}
 */
const getProp: Prop = {
  id (obj) {
    if (!isObjectStrict(obj)) {
      return ''
    }

    if (config.cms.name === 'contentful') {
      return isStringStrict(obj.sys?.id) ? obj.sys.id : ''
    }

    return isStringStrict(obj.id) ? obj.id : ''
  },
  type (obj, subtype = 'render') {
    if (!isObjectStrict(obj)) {
      return ''
    }

    let type = ''

    if (config.cms.name === 'contentful') {
      if (isStringStrict(obj.sys?.contentType?.sys?.id)) {
        type = obj.sys.contentType.sys.id
      }

      if (isStringStrict(obj?.sys?.type) && type === '') {
        type = obj.sys.type
      }
    } else {
      const key = subtype === 'render' ? 'renderType' : 'contentType'
      const value = obj[key]

      if (isStringStrict(value)) {
        type = value
      }
    }

    if (subtype === 'render' && isStringStrict(config.renderTypes[type])) {
      type = config.renderTypes[type]
    }

    return type
  },
  self <T>(obj: T) {
    if (!isObjectStrict(obj)) {
      return obj
    }

    if (config.cms.name === 'contentful') {
      const key = 'fields' as keyof T
      const fields = obj[key] as T

      return fields
    }

    return obj
  },
  fields <T, P extends keyof T>(obj: T, prop: P) {
    if (!isObjectStrict(obj)) {
      return
    }

    if (config.cms.name === 'contentful') {
      const key = 'fields' as keyof T
      const fields = obj[key] as T

      if (!isObjectStrict(fields)) {
        return
      }

      return fields[prop]
    }

    return obj[prop]
  },
  file (obj, prop = 'url', source: string = config.source) {
    const res = {
      url: '',
      path: '',
      name: '',
      type: '',
      format: '',
      alt: '',
      naturalWidth: 0,
      naturalHeight: 0,
      size: 0
    }

    const fallback = prop === 'url' || prop === 'type' ? '' : undefined

    if (!isObjectStrict(obj)) {
      return fallback
    }

    if (config.cms.name === 'contentful' && source === 'cms') {
      const fields = obj.fields
      const file = obj.fields?.file

      if (fields === undefined || file === undefined) {
        return fallback
      }

      if (isStringStrict(file.url)) {
        const url = `https:${file.url}`

        res.url = url

        if (prop === 'url') {
          return url
        }
      }

      if (isStringStrict(file.contentType)) {
        const type = file.contentType

        res.type = file.contentType

        if (prop === 'type') {
          return type
        }

        res.format = type.split('/')[1]
      }

      res.alt = isStringStrict(fields.description) ? fields.description : ''
      res.name = isStringStrict(file.fileName) ? file.fileName : ''
      res.naturalWidth = isNumber(file.details?.image?.width) ? file.details.image.width : 0
      res.naturalHeight = isNumber(file.details?.image?.height) ? file.details.image.height : 0
      res.size = isNumber(file.details?.size) ? file.details.size : 0
    } else {
      const {
        path = '',
        name = '',
        type = '',
        format = 'jpg',
        width = 0,
        height = 0,
        size = 0
      } = obj

      if (isStringStrict(path)) {
        const url = `${config.image.url}${path}`

        res.url = url

        if (prop === 'url') {
          return `${url}.${format}`
        }
      }

      if (isStringStrict(type)) {
        res.type = type

        if (prop === 'type') {
          return type
        }
      }

      res.path = path
      res.name = name
      res.format = format
      res.naturalWidth = width
      res.naturalHeight = height
      res.size = size
    }

    if (prop === 'all' && res.url !== '') {
      res.format = res.format === 'jpeg' ? 'jpg' : res.format
      return res
    }

    return fallback
  },
  tag (obj, id) {
    if (!isObjectStrict(obj) || !isStringStrict(id)) {
      return
    }

    const tags = obj.metadata?.tags

    if (!isArrayStrict(tags)) {
      return
    }

    const tagInfo = {
      id: '',
      name: ''
    }

    tags.find((t) => {
      if (!isObjectStrict(t)) {
        return false
      }

      const tagObj = config.cms.name === 'contentful' ? t.sys : t

      if (!isObjectStrict(tagObj)) {
        return false
      }

      const tagId = tagObj.id

      if (tagId === id) {
        tagInfo.id = tagId
        tagInfo.name = isStringStrict(tagObj.name) ? tagObj.name : ''

        return true
      }

      return false
    })

    return tagInfo
  }
}

/* Exports */

export { getProp }
