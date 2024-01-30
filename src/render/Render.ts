/**
 * Render
 */

/* Imports */

import type {
  RenderSlugs,
  RenderMetaArgs,
  RenderMetaReturn,
  RenderContentArgs,
  RenderServerlessData,
  RenderItemArgs,
  RenderItemReturn,
  RenderItemStartActionArgs,
  RenderItemActionArgs,
  RenderLayoutArgs,
  RenderArgs,
  RenderReturn
} from './RenderTypes'
import type { Generic, GenericStrings, ParentArgs, SlugParent } from '../global/globalTypes'
import type { PaginationData } from '../components/Pagination/PaginationTypes'
import type { SlugArgs } from '../utils/getSlug/getSlugTypes'
import {
  setActions,
  doActions,
  setFilters,
  applyFilters,
  getSlug,
  getPermalink,
  getProp,
  isString,
  isStringStrict,
  isArray,
  isArrayStrict,
  isObject,
  isObjectStrict,
  isNumber,
  getObjectKeys
} from '../utils'
import { config } from '../config/config'
import { Container } from '../layouts/Container/Container'
import { Column } from '../layouts/Column/Column'
import { Form } from '../objects/Form/Form'
import { Field } from '../objects/Field/Field'
import { RichText } from '../text/RichText/RichText'
import { RichTextContentItem } from '../text/RichText/RichTextTypes'

/**
 * Store slug data for json
 *
 * @private
 * @type {RenderSlugs}
 */
const _slugs: RenderSlugs = {}

/**
 * Function - normalize meta properties into one object
 *
 * @private
 * @param {RenderMetaArgs} args
 * @return {RenderMetaReturn}
 */
const _getMeta = (args: RenderMetaArgs): RenderMetaReturn => {
  const meta = {
    title: '',
    description: '',
    url: '',
    image: '',
    canonical: '',
    prev: '',
    next: '',
    noIndex: false,
    isIndex: false
  }

  if (!isObjectStrict(args)) {
    return meta
  }

  if (isObjectStrict(args.meta)) {
    return Object.assign(meta, args.meta)
  }

  if (isStringStrict(args.metaTitle)) {
    meta.title = args.metaTitle
  }

  if (isStringStrict(args.metaDescription)) {
    meta.description = args.metaDescription
  }

  const imageUrl = getProp.file(args.metaImage, 'url')
  meta.image = isStringStrict(imageUrl) ? imageUrl : ''

  return meta
}

/**
 * Function - add pagination data to meta object
 *
 * @private
 * @param {PaginationData} args
 * @return {void}
 */
const _setPaginationMeta = (args: PaginationData, slugArgs: SlugArgs, meta: RenderMetaReturn): void => {
  const {
    current = 0,
    currentFilters,
    prevFilters,
    nextFilters
  } = args

  slugArgs.page = current > 1 ? current : 0

  const c = getSlug(slugArgs)

  if (isObject(c)) {
    meta.canonical = `${getPermalink(c.slug, current === 1)}${isString(currentFilters) ? currentFilters : ''}`
  }

  if (isStringStrict(args.title)) {
    meta.paginationTitle = args.title
  }

  if (isNumber(args.prev)) {
    slugArgs.page = args.prev > 1 ? args.prev : 0

    const p = getSlug(slugArgs)

    if (isObject(p)) {
      meta.prev = `${getPermalink(p.slug, args.prev === 1)}${isString(prevFilters) ? prevFilters : ''}`
    }
  }

  if (isNumber(args.next) && args.next > 1) {
    slugArgs.page = args.next

    const n = getSlug(slugArgs)

    if (isObject(n)) {
      meta.next = `${getPermalink(n.slug, false)}${isString(nextFilters) ? nextFilters : ''}`
    }
  }
}

/**
 * Function - map out content slots to templates for contentTemplate
 *
 * @private
 * @param {object|object[]} templates
 * @param {object[]} content
 * @return {undefined}
 */
const _mapContentTemplate = <T, U>(templates: T, content: U): undefined => {
  if (!isArray(content)) {
    return
  }

  if (isArrayStrict(templates)) {
    templates.forEach((t, i) => {
      const templateRenderType = getProp.type(t as Generic, 'render')
      const templateChildren = getProp.fields(t as Generic, 'content')

      if (templateRenderType === 'content' && content.length > 0) {
        templates.unshift()
        templates[i] = content.shift()

        return
      }

      if (isObject(templateChildren)) {
        _mapContentTemplate(templateChildren, content)
      }
    })
  }

  if (isObjectStrict(templates)) {
    getObjectKeys(templates).forEach((t) => {
      const template = templates[t]
      const templateChildren = getProp.fields(template as Generic, 'content')

      if (isObject(templateChildren)) {
        _mapContentTemplate(templateChildren, content)
      }
    })
  }
}

/**
 * Function - recurse and output nested content
 *
 * @private
 * @param {RenderContentArgs} args
 * @return {void}
 */
const _renderContent = async (args: RenderContentArgs): Promise<void> => {
  if (!isObject(args)) {
    return
  }

  const {
    contentData = [],
    serverlessData,
    output,
    pageData,
    pageContains = [],
    navigations = {},
    renderFunctions = {}
  } = args

  let {
    parents = []
  } = args

  /* Content must be array */

  if (!isArrayStrict(contentData)) {
    return
  }

  /* Loop */

  for (let i = 0; i < contentData.length; i += 1) {
    let c = contentData[i]

    if (!isObjectStrict(c)) {
      continue
    }

    /* Store html string and filter info */

    let filterType = ''
    let filterArgs = {}
    let richTextOutput = ''

    /* Check for embedded entries and rich text */

    const richTextNodeType = c.nodeType

    if (isStringStrict(richTextNodeType)) {
      if (richTextNodeType === 'embedded-entry-block' || richTextNodeType === 'embedded-asset-block') {
        c = isObjectStrict(c.data?.target) ? c.data.target : c
      } else {
        let richTextContent

        if (isStringStrict(c.content) || isArrayStrict(c.content)) {
          richTextContent = c.content
        }

        const richTextArgs = {
          args: {
            type: richTextNodeType,
            content: richTextContent as string | RichTextContentItem[] | undefined
          },
          parents
        }

        richTextOutput = await RichText(richTextArgs)
        filterType = 'richText'
        filterArgs = {
          type: richTextNodeType,
          content: richTextContent
        }
      }
    }

    /* Render props */

    const normalProps = getProp.self(c)
    const normalRenderType = getProp.type(c, 'render')
    const props = isObjectStrict(normalProps) ? normalProps : {}
    const renderType = isString(normalRenderType) ? normalRenderType : ''
    const id = getProp.id(c)

    if (isStringStrict(id)) {
      props.id = id
    }

    /* Check for nested content */

    let children = props.content
    let recurse = children !== undefined

    if (isObjectStrict(children)) {
      const nestedChildren = children.content

      if (children.nodeType !== undefined && nestedChildren !== undefined) {
        children = nestedChildren
        recurse = true
      }
    }

    /* Map out content to template */

    if (renderType === 'contentTemplate') {
      const templates = isArray(props.templates) ? props.templates : []

      _mapContentTemplate(templates, props.content)

      children = templates
      recurse = true
    }

    /* Render output */

    let renderObj = {
      start: '',
      end: ''
    }

    const renderFunction = renderFunctions[renderType]

    if (typeof renderFunction === 'function') {
      const renderArgs = {
        args: props,
        parents,
        pageData,
        pageContains,
        navigations,
        serverlessData
      }

      const renderOutput = await renderFunction(renderArgs)

      if (isString(renderOutput)) {
        renderObj.start = renderOutput
      } else {
        renderObj = renderOutput
      }

      pageContains.push(renderType)

      filterType = renderType
      filterArgs = props
    }

    let start = renderObj.start
    let end = renderObj.end

    /* Filter start and end output */

    const renderContentFilterArgs: ParentArgs = {
      renderType: filterType,
      args: filterArgs
    }

    if (start !== '' && end === '') {
      start = await applyFilters('renderContent', start, renderContentFilterArgs)
    } else {
      start = await applyFilters('renderContentStart', start, renderContentFilterArgs)
      end = await applyFilters('renderContentEnd', end, renderContentFilterArgs)
    }

    if (richTextOutput !== '') {
      richTextOutput = await applyFilters('renderContent', richTextOutput, renderContentFilterArgs)
    }

    /* Add to output object */

    output.html += richTextOutput
    output.html += start

    /* Recurse through children */

    if (isArrayStrict(children) && recurse) {
      const parentsCopy = [...parents]

      parentsCopy.unshift({
        renderType,
        args: props
      })

      await _renderContent({
        contentData: children,
        serverlessData,
        output,
        parents: parentsCopy,
        pageData,
        pageContains,
        navigations,
        renderFunctions
      })
    }

    output.html += end

    /* Clear parents */

    if (renderType !== '' && renderType !== 'content' && end !== '') {
      parents = []
    }
  }
}

/**
 * Function - output single post or page
 *
 * @private
 * @param {RenderItemArgs} args
 * @return {RenderItemReturn}
 */
const _renderItem = async (args: RenderItemArgs): Promise<RenderItemReturn> => {
  if (!isObjectStrict(args)) {
    return {}
  }

  const {
    item,
    contentType = 'page',
    serverlessData,
    renderFunctions
  } = args

  /* Item must be object */

  if (!isObjectStrict(item)) {
    return {}
  }

  /* Item id required */

  const id = getProp.id(item)

  if (!isStringStrict(id)) {
    return {}
  }

  /* Item props */

  const props = getProp.self(item)

  if (!isObjectStrict(item)) {
    return {}
  }

  /* Slug required */

  if (!isStringStrict(props.slug)) {
    return {}
  }

  /* Serverless render check */

  let serverlessRender = false

  /* Store components contained in page  */

  const pageContains: string[] = []

  /* Start action */

  const renderItemStartArgs: RenderItemStartActionArgs = {
    id,
    pageData: props,
    contentType,
    pageContains,
    serverlessData
  }

  await doActions('renderItemStart', renderItemStartArgs)

  /* Reset script and style files */

  config.scripts.item = {}
  config.styles.item = {}

  /* Meta */

  const title = props.title
  const meta = _getMeta(props)

  if (!isStringStrict(meta.title)) {
    meta.title = title
  }

  /* Permalink */

  const slugArgs = {
    id,
    contentType,
    linkContentType: props.linkContentType,
    slug: props.slug,
    returnParents: true,
    page: 0
  }

  const s = getSlug(slugArgs)

  let slug = ''
  let permalink = ''
  let parents: SlugParent[] = []

  if (!isString(s)) {
    slug = s.slug
    parents = s.parents
    permalink = getPermalink(slug)
    item.basePermalink = getPermalink(slug)
  }

  meta.url = permalink
  meta.canonical = permalink

  /* Add to data by slugs store */

  const formattedSlug = slug !== 'index' && slug !== '' ? `/${slug}/` : '/'

  _slugs[formattedSlug] = {
    contentType,
    id
  }

  /* Check if index */

  const index = props.slug === 'index'

  meta.isIndex = index

  /* Navigations */

  let navigations: GenericStrings = {}

  if (typeof renderFunctions.navigations === 'function') {
    navigations = renderFunctions.navigations({
      navigations: config.navigation,
      items: config.navigationItem,
      current: permalink,
      title,
      parents
    })
  }

  /* Serverless data */

  let itemServerlessData: RenderServerlessData | undefined

  if (isObjectStrict(serverlessData)) {
    const serverlessPath = serverlessData.path !== undefined ? serverlessData.path : ''

    if (serverlessPath === formattedSlug && serverlessData.query !== undefined) {
      itemServerlessData = serverlessData
    } else { // Avoid re-rendering non dynamic pages
      return {
        serverlessRender: false
      }
    }
  }

  /* Content loop */

  const contentOutput = { html: '' }

  let contentData = props.content

  if (isObjectStrict(contentData)) {
    contentData = contentData.content
  }

  if (isArrayStrict(contentData)) {
    await _renderContent({
      contentData,
      serverlessData: itemServerlessData,
      output: contentOutput,
      parents: [],
      pageData: item,
      pageContains,
      navigations,
      renderFunctions
    })
  }

  /* Pagination variables for meta object */

  if (isObjectStrict(item.pagination)) {
    _setPaginationMeta(item.pagination, slugArgs, meta)
    serverlessRender = true
  }

  /* Page data (props) for layout and actions */

  const pageData = { ...props }

  pageData.id = id
  pageData.parents = parents
  pageData.content = []

  /* Output */

  let layoutOutput = ''

  if (typeof renderFunctions.layout === 'function') {
    const layoutArgs: RenderLayoutArgs = {
      id,
      meta,
      navigations,
      contentType,
      content: contentOutput.html,
      slug: formattedSlug,
      pageContains,
      pageData,
      serverlessData
    }

    layoutOutput = await renderFunctions.layout(layoutArgs)
  }

  const renderItemFilterArgs: RenderItemActionArgs = {
    id,
    contentType,
    slug: formattedSlug,
    output: layoutOutput,
    pageData,
    pageContains,
    serverlessData
  }

  layoutOutput = await applyFilters('renderItem', layoutOutput, renderItemFilterArgs)

  /* End action */

  const renderItemEndArgs: RenderItemActionArgs = {
    id,
    contentType,
    slug: formattedSlug,
    output: layoutOutput,
    pageData,
    pageContains,
    serverlessData
  }

  await doActions('renderItemEnd', renderItemEndArgs)

  /* Output */

  return {
    serverlessRender,
    pageData,
    data: {
      slug: formattedSlug,
      output: layoutOutput
    }
  }
}

/**
 * Function - loop through all content types to output pages and posts
 *
 * @param {RenderArgs} args
 * @return {Promise<RenderReturn[]|RenderReturn>}
 */
const Render = async ({
  allData,
  serverlessData,
  previewData
}: RenderArgs): Promise<RenderReturn[] | RenderReturn> => {
  /* Set filters and actions */

  setFilters(config.filters)
  setActions(config.actions)

  await doActions('renderStart')

  /* Reset script and style directories */

  config.scripts.build = {}
  config.styles.build = {}

  /* Data */

  if (!isObjectStrict(allData)) {
    return [{
      slug: '',
      output: ''
    }]
  }

  const {
    navigation,
    navigationItem,
    redirect,
    content
  } = allData

  /* Store navigations and items */

  config.navigation = navigation
  config.navigationItem = navigationItem

  /* Add formation functions */

  const renderFunctions = { ...config.renderFunctions }

  if (typeof renderFunctions.container !== 'function') {
    renderFunctions.container = Container
  }

  if (typeof renderFunctions.column !== 'function') {
    renderFunctions.column = Column
  }

  if (typeof renderFunctions.form !== 'function') {
    renderFunctions.form = Form
  }

  if (typeof renderFunctions.field !== 'function') {
    renderFunctions.field = Field
  }

  if (typeof renderFunctions.richText !== 'function') {
    renderFunctions.richText = RichText
  }

  /* Store content data */

  const data: RenderReturn[] = []

  /* Loop through pages first to set parent slugs */

  if (serverlessData === undefined) {
    for (let i = 0; i < content.page.length; i += 1) {
      const item = content.page[i]
      const itemProp = getProp.self(item)
      const itemData = Object.assign({
        parent: undefined,
        archive: '',
        linkContentType: 'default'
      }, isObjectStrict(itemProp) ? itemProp : {})

      let {
        parent,
        archive = '',
        linkContentType = 'default'
      } = itemData

      archive = await applyFilters('renderArchiveName', archive)
      linkContentType = await applyFilters('renderLinkContentTypeName', linkContentType)

      const idProp = getProp.id(item)
      const id = isStringStrict(idProp) ? idProp : ''
      const isArchive = isStringStrict(archive) && id !== ''

      if (isArchive) {
        const archiveIds = config.archive.ids
        const contentTypeArchive = config.contentTypes.archive?.[archive]?.id

        if (archiveIds[archive] === undefined) {
          archiveIds[archive] = {}
        }

        archiveIds[archive][linkContentType] = id

        if (isObjectStrict(contentTypeArchive)) {
          contentTypeArchive[linkContentType] = id
        }
      }

      if (isObjectStrict(parent) && id !== '') {
        const parentSlug = getProp.fields(parent, 'slug')
        const parentTitle = getProp.fields(parent, 'title')
        const parentId = getProp.id(parent)

        if (isStringStrict(parentSlug) && isStringStrict(parentTitle) && isStringStrict(parentId)) {
          config.slug.parents[id] = {
            id: parentId,
            slug: parentSlug,
            title: parentTitle,
            contentType: 'page'
          }
        }
      }
    }

    if (isArrayStrict(redirect)) {
      redirect.forEach((r) => {
        const redirectProp = getProp.self(r)

        if (!isObjectStrict(redirectProp)) {
          return
        }

        const { redirect: rr = [] } = redirectProp

        if (!isArrayStrict(rr)) {
          return
        }

        config.redirects.data = config.redirects.data.concat(rr)
      })
    }
  } else {
    const dir = config.store.dir
    const files = config.store.files

    /* eslint-disable @typescript-eslint/no-var-requires */
    const slugParentsJson = require(`${dir}${files.slugParents.name}`)
    const archiveIdsJson = require(`${dir}${files.archiveIds.name}`)
    const archiveTermsJson = require(`${dir}${files.archiveTerms.name}`)
    const archivePostsJson = require(`${dir}${files.archivePosts.name}`)
    const formMetaJson = require(`${dir}${files.formMeta.name}`)
    const navigationsJson = require(`${dir}${files.navigations.name}`)

    if (slugParentsJson != null) {
      Object.keys(slugParentsJson).forEach((s) => {
        config.slug.parents[s] = slugParentsJson[s]
      })
    }

    if (archiveIdsJson != null) {
      config.archive.ids = archiveIdsJson

      Object.keys(archiveIdsJson).forEach((a) => {
        if (config.contentTypes.archive[a] != null) {
          config.contentTypes.archive[a].id = archiveIdsJson[a]
        }
      })
    }

    if (archiveTermsJson != null) {
      config.archive.terms = archiveTermsJson
    }

    if (archivePostsJson != null) {
      config.archive.posts = archivePostsJson
    }

    if (formMetaJson != null) {
      config.formMeta = formMetaJson
    }

    if (navigationsJson != null) {
      config.navigation = navigationsJson.navigation
      config.navigationItem = navigationsJson.navigationItem
    }
  }

  /* Empty serverless reload */

  Object.keys(config.serverless.routes).forEach((r) => {
    config.serverless.routes[r] = []
  })

  /* Loop through all content types */

  const contentTypes = Object.keys(content)

  for (let c = 0; c < contentTypes.length; c += 1) {
    const contentType = contentTypes[c]

    for (let i = 0; i < content[contentType].length; i += 1) {
      const item = await _renderItem({
        item: content[contentType][i],
        contentType,
        serverlessData,
        renderFunctions
      })

      const {
        serverlessRender = false,
        data: itemData
      } = item

      if (itemData !== undefined) {
        data.push(itemData)

        if (serverlessRender && serverlessData === undefined) {
          config.serverless.routes.reload.push({
            path: itemData.slug.replace(/^\/|\/$/gm, '')
          })
        }
      }
    }
  }

  /* Files data */

  if (serverlessData === undefined && previewData === undefined) {
    config.store.files.slugs.data = JSON.stringify(_slugs)
    config.store.files.slugParents.data = JSON.stringify(config.slug.parents)
    config.store.files.archiveIds.data = JSON.stringify(config.archive.ids)
    config.store.files.archiveTerms.data = JSON.stringify(config.archive.terms)
    config.store.files.archivePosts.data = JSON.stringify(config.archive.posts)
    config.store.files.formMeta.data = JSON.stringify(config.formMeta)
    config.store.files.navigations.data = JSON.stringify({
      navigations: config.navigation,
      navigationItems: config.navigationItem
    })
  }

  /* Output */

  await doActions('renderEnd', serverlessData !== undefined || previewData !== undefined ? data[0] : data)

  if (serverlessData !== undefined || previewData !== undefined) {
    return data[0]
  }

  return data
}

/* Exports */

export { Render }
