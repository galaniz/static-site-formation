/**
 * Utils - Get All Contentful Data Types
 */

/* Imports */

import type { RenderServerlessData, RenderPreviewData } from '../../render/RenderTypes'

/**
 * @typedef {object} AllContentfulDataArgs
 * @prop {ServerlessData} [serverlessData]
 * @prop {PreviewData} [previewData]
 * @prop {function} [filterData]
 * @prop {function} [filterAllData]
 */
export interface AllContentfulDataArgs {
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
  filterData?: Function
  filterAllData?: Function
}
