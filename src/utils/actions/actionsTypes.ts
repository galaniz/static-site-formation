/**
 * Utils - Actions Types
 */

/* Imports */

import type { GenericFunctions } from '../../global/globalTypes'
import type {
  RenderStartAction,
  RenderEndAction,
  RenderItemStartAction,
  RenderItemEndAction
} from '../../render/RenderTypes'

/**
 * @typedef Actions
 * @type {import('../../global/globalTypes').GenericFunctions}
 * @prop {import('../../render/RenderTypes').RenderStartAction} renderStart
 * @prop {import('../../render/RenderTypes').RenderEndAction} renderEnd
 * @prop {import('../../render/RenderTypes').RenderItemStartAction} renderItemStart
 * @prop {import('../../render/RenderTypes').RenderItemEndAction} renderItemEnd
 */
export interface Actions extends GenericFunctions {
  renderStart: RenderStartAction
  renderEnd: RenderEndAction
  renderItemStart: RenderItemStartAction
  renderItemEnd: RenderItemEndAction
}

/**
 * @typedef ActionsFunctions
 * @type {Object.<string, function[]>}
 * @prop {import('../../render/RenderTypes').RenderStartAction[]} renderStart
 * @prop {import('../../render/RenderTypes').RenderEndAction[]} renderEnd
 * @prop {import('../../render/RenderTypes').RenderItemStartAction[]} renderItemStart
 * @prop {import('../../render/RenderTypes').RenderItemEndAction[]} renderItemEnd
 */
export interface ActionsFunctions {
  renderStart: RenderStartAction[]
  renderEnd: RenderEndAction[]
  renderItemStart: RenderItemStartAction[]
  renderItemEnd: RenderItemEndAction[]
  [key: string]: Function[]
}
