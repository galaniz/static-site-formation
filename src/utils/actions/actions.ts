/**
 * Utils - Actions
 */

/* Imports */

import type { Actions, ActionsFunctions } from './actionsTypes'
import { isStringStrict } from '../isString/isString'
import { isArrayStrict } from '../isArray/isArray'
import { isObjectStrict } from '../isObject/isObject'
import { isFunction } from '../isFunction/isFunction'

/**
 * Store action callbacks by name
 *
 * @type {import('./actionsTypes').ActionsFunctions}
 */
let actions: ActionsFunctions = {
  renderStart: [],
  renderEnd: [],
  renderItemStart: [],
  renderItemEnd: []
}

/**
 * Function - add action to action object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const addAction = <T extends keyof Actions>(name: T, action: Actions[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
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
const removeAction = <T extends keyof Actions>(name: T, action: Actions[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
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

      if (isFunction(callback)) {
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
  actions = {
    renderStart: [],
    renderEnd: [],
    renderItemStart: [],
    renderItemEnd: []
  }
}

/**
 * Function - fill actions object
 *
 * @param {import('./actionsTypes').Actions} args
 * @return {boolean}
 */
const setActions = (args: Partial<Actions>): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  if (Object.keys(args).length === 0) {
    return false
  }

  resetActions()

  Object.keys(args).forEach((a) => {
    const arg = args[a]

    if (!isFunction(arg)) {
      return
    }

    addAction(a, arg)
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
