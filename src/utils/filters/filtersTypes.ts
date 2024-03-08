/**
 * Utils - Filters Types
 */

/* Imports */

import type { GenericFunctions } from '../../global/globalTypes'
import type { ColumnPropsFilter } from '../../layouts/Column/ColumnTypes'
import type { ContainerPropsFilter } from '../../layouts/Container/ContainerTypes'
import type { FieldPropsFilter } from '../../objects/Field/FieldTypes'
import type { FormPropsFilter } from '../../objects/Form/FormTypes'
import type {
  RichTextPropsFilter,
  RichTextOutputFilter,
  RichTextContentFilter,
  RichTextContentOutputFilter,
  RichTextNormalizeContentFilter
} from '../../text/RichText/RichTextTypes'
import type { ContentfulDataReturn } from '../getContentfulData/getContentfulDataTypes'
import type { FileDataReturn } from '../getFileData/getFileDataTypes'
import type { AjaxResFilter } from '../../serverless/Ajax/AjaxTypes'
import type { RenderNameFilter, RenderItemFilter, RenderContentFilter } from '../../render/RenderTypes'

/**
 * @typedef {
 * import('../getContentfulData/getContentfulDataTypes').ContentfulDataReturn|
 * import('../getFileData/getFileDataTypes').FileDataReturn
 * } CacheData
 */
type CacheData = ContentfulDataReturn | FileDataReturn

/**
 * @typedef {object} CacheDataFilterArgs
 * @prop {string} key
 * @prop {string} type
 * @prop {CacheData} [data]
 */
export interface CacheDataFilterArgs {
  key: string
  type: string
  data?: CacheData
}

/**
 * @typedef {function} CacheDataFilter
 * @param {CacheData} data
 * @return {CacheData|undefined}
 */
export type CacheDataFilter = (data: CacheData, args: CacheDataFilterArgs) => Promise<CacheData | undefined>

/**
 * @typedef Filters
 * @type {import('../../global/globalTypes').GenericFunctions}
 * @prop {import('../../layouts/Column/ColumnTypes').ColumnPropsFilter} columnProps
 * @prop {import('../../layouts/Container/ContainerTypes').ContainerPropsFilter} containerProps
 * @prop {import('../../objects/Field/FieldTypes').FieldPropsFilter} fieldProps
 * @prop {import('../../objects/Form/FormTypes').FormPropsFilter} formProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextPropsFilter} richTextProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextOutputFilter} richTextOutput
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentFilter} richTextContent
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentOutputFilter} richTextContentOutput
 * @prop {import('../../text/RichText/RichTextTypes').RichTextNormalizeContentFilter} richTextNormalizeContent
 * @prop {import('../../render/RenderTypes').RenderNameFilter} renderArchiveName
 * @prop {import('../../render/RenderTypes').RenderNameFilter} renderLinkContentTypeName
 * @prop {import('../../render/RenderTypes').RenderItemFilter} renderItem
 * @prop {import('../../render/RenderTypes').RenderContentFilter} renderContent
 * @prop {import('../../render/RenderTypes').RenderContentFilter} renderContentStart
 * @prop {import('../../render/RenderTypes').RenderContentFilter} renderContentEnd
 * @prop {import('../../serverless/Ajax/AjaxTypes').AjaxResFilter} ajaxRes
 * @prop {CacheDataFilter} cacheData
 */
export interface Filters extends GenericFunctions {
  columnProps: ColumnPropsFilter
  containerProps: ContainerPropsFilter
  fieldProps: FieldPropsFilter
  formProps: FormPropsFilter
  richTextProps: RichTextPropsFilter
  richTextOutput: RichTextOutputFilter
  richTextContent: RichTextContentFilter
  richTextContentOutput: RichTextContentOutputFilter
  richTextNormalizeContent: RichTextNormalizeContentFilter
  renderArchiveName: RenderNameFilter
  renderLinkContentTypeName: RenderNameFilter
  renderItem: RenderItemFilter
  renderContent: RenderContentFilter
  renderContentStart: RenderContentFilter
  renderContentEnd: RenderContentFilter
  ajaxRes: AjaxResFilter
  cacheData: CacheDataFilter
}

/**
 * @typedef FiltersFunctions
 * @type {Object.<string, function[]>}
 * @prop {import('../../layouts/Column/ColumnTypes').ColumnPropsFilter[]} columnProps
 * @prop {import('../../layouts/Container/ContainerTypes').ContainerPropsFilter[]} containerProps
 * @prop {import('../../objects/Field/FieldTypes').FieldPropsFilter[]} fieldProps
 * @prop {import('../../objects/Form/FormTypes').FormPropsFilter[]} formProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextPropsFilter[]} richTextProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextOutputFilter[]} richTextOutput
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentFilter[]} richTextContent
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentOutputFilter[]} richTextContentOutput
 * @prop {import('../../text/RichText/RichTextTypes').RichTextNormalizeContentFilter[]} richTextNormalizeContent
 * @prop {import('../../render/RenderTypes').RenderNameFilter[]} renderArchiveName
 * @prop {import('../../render/RenderTypes').RenderNameFilter[]} renderLinkContentTypeName
 * @prop {import('../../render/RenderTypes').RenderItemFilter[]} renderItem
 * @prop {import('../../render/RenderTypes').RenderContentFilter[]} renderContent
 * @prop {import('../../render/RenderTypes').RenderContentFilter[]} renderContentStart
 * @prop {import('../../render/RenderTypes').RenderContentFilter[]} renderContentEnd
 * @prop {import('../../serverless/Ajax/AjaxTypes').AjaxResFilter[]} ajaxRes
 * @prop {CacheDataFilter[]} cacheData
 */
export interface FiltersFunctions {
  columnProps: ColumnPropsFilter[]
  containerProps: ContainerPropsFilter[]
  fieldProps: FieldPropsFilter[]
  formProps: FormPropsFilter[]
  richTextProps: RichTextPropsFilter[]
  richTextOutput: RichTextOutputFilter[]
  richTextContent: RichTextContentFilter[]
  richTextContentOutput: RichTextContentOutputFilter[]
  richTextNormalizeContent: RichTextNormalizeContentFilter[]
  renderArchiveName: RenderNameFilter[]
  renderLinkContentTypeName: RenderNameFilter[]
  renderItem: RenderItemFilter[]
  renderContent: RenderContentFilter[]
  renderContentStart: RenderContentFilter[]
  renderContentEnd: RenderContentFilter[]
  ajaxRes: AjaxResFilter[]
  cacheData: CacheDataFilter[]
  [key: string]: Function[]
}
