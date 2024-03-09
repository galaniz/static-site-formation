/**
 * Utils - Write Serverless Files Types
 */

/**
 * @typedef {object} ServerlessFilesArgs
 * @prop {string} [packageDir]
 * @prop {string} [configName]
 * @prop {string} [configFile]
 */
export interface ServerlessFilesArgs {
  packageDir?: string
  configName?: string
  configFile?: string
}
