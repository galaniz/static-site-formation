/**
 * Utils - Get Prop Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes'

/**
 * @typedef Prop
 * @type {Generic}
 * @prop {object} [sys]
 * @prop {string} [sys.id]
 * @prop {string} [sys.type]
 * @prop {object} [sys.contentType]
 * @prop {object} [sys.contentType.sys]
 * @prop {string} [sys.contentType.sys.id]
 * @prop {Object.<string, *>} [fields]
 */
export interface Prop extends Generic {
  sys?: {
    id?: string
    type?: string
    contentType?: {
      sys?: {
        id?: string
      }
    }
  }
  fields?: Generic
}
