/**
 * Utils - Filters Types
 */

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

export type CacheDataFilter = (data: ContentfulDataReturn | FileDataReturn, args: {
  key: string
  type: string
  data?: ContentfulDataReturn | FileDataReturn
}) => Promise<ContentfulDataReturn | FileDataReturn | undefined>

export interface Filters {
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
  [key: string]: Function
}

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
