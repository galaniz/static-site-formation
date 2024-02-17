/**
 * Utils - Shortcodes Types
 */

/* Imports */

import type { GenericStrings } from '../../global/globalTypes'

/**
 * @typedef {string|number|boolean} ShortcodeAttrValue
 */
export type ShortcodeAttrValue = string | number | boolean

/**
 * @typedef {Object.<string, ShortcodeAttrValue>} ShortcodeAttrs
 */
export interface ShortcodeAttrs {
  [key: string]: ShortcodeAttrValue
}

/**
 * @typedef {object} ShortcodeData
 * @prop {string} name
 * @prop {string} replaceContent
 * @prop {string} content
 * @prop {ShortcodeAtts} attributes
 * @prop {ShortcodeData[]} children
 */
export interface ShortcodeData {
  name: string
  replaceContent: string
  content: string
  attributes: ShortcodeAttrs
  children: ShortcodeData[]
}

/**
 * @typedef {function} ShortcodeCallback
 * @param {ShortcodeData} args
 * @return {Promise<string>}
 */
export type ShortcodeCallback = (args: ShortcodeData) => Promise<string>

/**
 * @typedef {object} Shortcode
 * @prop {string} [child]
 * @prop {ShortcodeCallback} callback
 */
export interface Shortcode {
  child?: string
  attributeTypes: GenericStrings
  callback: ShortcodeCallback
}

/**
 * @typedef {Object.<string, Shortcode>} Shortcodes
 */
export interface Shortcodes {
  [key: string]: Shortcode
}
