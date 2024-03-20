/**
 * Utils - Get All Contentful Data Types
 */

/* Imports */

import type { RenderServerlessData, RenderPreviewData } from '../../render/renderTypes'

/**
 * @typedef {object} AllContentfulDataArgs
 * @prop {import('../../render/RenderTypes').RenderServerlessData} [serverlessData]
 * @prop {import('../../render/RenderTypes').RenderPreviewData} [previewData]
 * @prop {function} [filterData]
 * @prop {function} [filterAllData]
 */
export interface AllContentfulDataArgs {
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
  filterData?: Function
  filterAllData?: Function
}
