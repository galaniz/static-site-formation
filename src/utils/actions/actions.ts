/**
 * Utils - Actions
 */

/* Imports */

import type { GenericFunctions } from '../../global/globalTypes'
import { isStringStrict } from '../isString/isString'
import { isArrayStrict } from '../isArray/isArray'
import { isObjectStrict } from '../isObject/isObject'

/**
 * Store action callbacks by name
 *
 * @type {Object.<string, function>}
 */
let actions: { [key: string]: Function[] } = {}

/**
 * Function - add action to action object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const addAction = (name: string, action: Function): boolean => {
  if (!isStringStrict(name) || typeof action !== 'function') {
    return false
  }

  if (actions[name] === undefined) {
    actions[name] = []
  }

  actions[name].push(action)

  return true
}

/**
 * Function - remove action from actions object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const removeAction = (name: string, action: Function): boolean => {
  if (!isStringStrict(name) || typeof action !== 'function') {
    return false
  }

  const callbacks = actions[name]

  if (isArrayStrict(callbacks)) {
    const index = callbacks.indexOf(action)

    if (index > -1) {
      actions[name].splice(index, 1)

      return true
    }
  }

  return false
}

/**
 * Function - run callback functions from actions object
 *
 * @param {string} name
 * @param {*} [args]
 * @return {Promise<void>}
 */
const doActions = async <T>(name: string, args?: T): Promise<void> => {
  const callbacks = actions[name]

  if (isArrayStrict(callbacks)) {
    for (let i = 0; i < callbacks.length; i += 1) {
      const callback = callbacks[i]

      if (typeof callback === 'function') {
        await callback(args)
      }
    }
  }
}

/**
 * Function - empty actions object
 *
 * @return {void}
 */
const resetActions = (): void => {
  actions = {}
}

/**
 * Function - fill actions object
 *
 * @param {Object.<string, Function>} args
 * @return {boolean}
 */
const setActions = (args: GenericFunctions): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  if (Object.keys(args).length === 0) {
    return false
  }

  resetActions()

  Object.keys(args).forEach((a) => {
    addAction(a, args[a])
  })

  return true
}

/* Exports */

export {
  addAction,
  removeAction,
  doActions,
  resetActions,
  setActions
}
