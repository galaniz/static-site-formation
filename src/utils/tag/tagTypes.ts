/**
 * Utils - Tag Types
 */

/* Imports */

import type { RenderItem } from '../../render/renderTypes'

/**
 * @typedef {function} TagGetMethod
 * @prop {RenderItem} obj
 * @prop {string} id
 * @return {TagGetReturn|undefined}
 */
type TagGetMethod = (obj: RenderItem, id: string) => TagGetReturn | undefined

/**
 * @typedef {function} TagExistsMethod
 * @prop {RenderItem} obj
 * @prop {string} id
 * @return {boolean}
 */
type TagExistsMethod = (obj: RenderItem, id: string) => boolean

/**
 * @typedef {object} TagGetReturn
 * @prop {string} id
 * @prop {string} name
 */
export interface TagGetReturn {
  id: string
  name: string
}

/**
 * @typedef {object} Tag
 * @prop {TagGetMethod} get
 * @prop {TagExistsMethod} exists
 */
export interface Tag {
  get: TagGetMethod
  exists: TagExistsMethod
}
