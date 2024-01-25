/**
 * Utils - Add Script Style Types
 */

/**
 * @typedef {object} ScriptStyleArgs
 * @prop {string} dir
 * @prop {string} [script]
 * @prop {string} [style]
 * @prop {number} [priority]
 */
export interface ScriptStyleArgs {
  dir: string
  script?: string
  style?: string
  priority?: number
}
