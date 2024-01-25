/**
 * Render
 */

/* Imports */

import type {
  RenderSlugs,
  RenderMetaArgs,
  RenderMetaReturn,
  RenderContentArgs,
  RenderRichTextData,
  RenderServerlessData,
  RenderItemArgs,
  RenderItemReturn,
  RenderItemStartActionArgs,
  RenderItemActionArgs,
  RenderLayoutArgs,
  RenderArgs,
  RenderReturn
} from './RenderTypes'
import type { Generic, ParentArgs, SlugParent } from '../global/globalTypes'
import type { PaginationData } from '../components/Pagination/PaginationTypes'
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
  isStringArray,
  isArray,
  isArrayStrict,
  isObject,
  isObjectStrict,
  isObjectArray
} from '../utils'
import { config } from '../config/config'
import { Container } from '../layouts/Container/Container'
import { Column } from '../layouts/Column/Column'
import { Form } from '../objects/Form/Form'
import { Field } from '../objects/Field/Field'
import { RichText } from '../text/RichText/RichText'

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

  if (isObjectStrict(args.metaImage)) {
    const imageUrl = args.metaImage?.fields?.file?.url

    if (isStringStrict(imageUrl)) {
      meta.image = `https:${imageUrl}`
    }
  }

  return meta
}

/**
 * Function - map out content slots to templates for contentTemplate
 *
 * @private
 * @param {Generic|Generic[]} templates
 * @param {Generic[]} content
 * @return {undefined}
 */
const _mapContentTemplate = <T, U>(templates: T, content: U): undefined => {
  if (!isArray(content)) {
    return
  }

  if (isArrayStrict(templates)) {
    templates.forEach((t, i) => {
      if (!isObjectStrict(t)) {
        return
      }

      const templateRenderType = getProp(t, 'renderType')
      const templateChildren = getProp(t, 'content')

      if (templateRenderType === 'content' && content.length > 0) {
        templates.unshift()

        if (templates[i] !== undefined) {
          content.shift()
        }

        return
      }

      if (isObject(templateChildren)) {
        _mapContentTemplate(templateChildren, content)
      }
    })
  }

  if (isObjectStrict(templates)) {
    Object.keys(templates).forEach((t) => {
      const template = templates[t]

      if (!isObjectStrict(template)) {
        return
      }

      const templateChildren = getProp(template, 'content')

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
        const richTextNode: RenderRichTextData = c

        if (isObjectStrict(richTextNode?.data?.target)) {
          c = richTextNode.data.target
        }
      } else {
        let richTextContent: string | Generic[] | undefined

        if (isStringStrict(c.content)) {
          richTextContent = c.content
        }

        if (isObjectArray(c.content)) {
          richTextContent = c.content
        }

        const richTextArgs = {
          args: {
            type: richTextNodeType,
            content: richTextContent
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

    /* Check for nested content */

    const contentChildren = getProp(c, 'content')

    let children: Generic[] | undefined
    let recurse = false

    if (isObjectArray(contentChildren)) {
      children = contentChildren
    }

    if (isObjectStrict(contentChildren)) {
      const nestedChildren = contentChildren.content

      if (contentChildren.nodeType !== undefined && isObjectArray(nestedChildren)) {
        children = nestedChildren
        recurse = true
      }
    }

    /* Render props */

    const normalProps = getProp(c, '', {})
    const normalRenderType = getProp(c, 'renderType')
    const props = isObjectStrict(normalProps) ? normalProps : {}
    const renderType = isString(normalRenderType) ? normalRenderType : ''
    const id = getProp(c, 'id')

    if (isStringStrict(id)) {
      props.id = id
    }

    /* Map out content to template */

    if (renderType === 'contentTemplate') {
      const templates = isArray(props.templates) ? props.templates : []

      _mapContentTemplate(templates, props.content)

      if (isObjectArray(templates)) {
        children = templates
        recurse = true
      }
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

  /* Serverless render check */

  let serverlessRender = false

  /* Item id */

  const idProp = getProp(item, 'id', '')
  const id = isStringStrict(idProp) ? idProp : ''

  /* Item props */

  const propsProp = getProp(item, '', {})
  const props = Object.assign({
    id: '',
    title: '',
    slug: '',
    content: [],
    linkContentType: 'default'
  }, isObjectStrict(propsProp) ? propsProp : {})

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

  let navigations: { [key: string]: string } = {}

  if (renderFunctions.navigations !== undefined) {
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

  let contentData: Generic | Generic[] = props.content

  if (isObjectStrict(contentData)) {
    contentData = isObjectArray(contentData.content) ? contentData.content : contentData
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
    serverlessRender = true

    const pagination: PaginationData = item.pagination

    const {
      current = 0,
      currentFilters,
      prevFilters,
      nextFilters
    } = pagination

    slugArgs.page = current > 1 ? current : 0

    const c = getSlug(slugArgs)

    if (typeof c === 'object') {
      meta.canonical = `${getPermalink(c.slug, current === 1)}${isString(currentFilters) ? currentFilters : ''}`
    }

    if (pagination.title !== undefined) {
      meta.paginationTitle = pagination.title
    }

    if (pagination.prev !== undefined) {
      slugArgs.page = pagination.prev > 1 ? pagination.prev : 0

      const p = getSlug(slugArgs)

      if (typeof p === 'object') {
        meta.prev = `${getPermalink(p.slug, pagination.prev === 1)}${isString(prevFilters) ? prevFilters : ''}`
      }
    }

    if (pagination.next !== undefined) {
      if (pagination.next > 1) {
        slugArgs.page = pagination.next

        const n = getSlug(slugArgs)

        if (typeof n === 'object') {
          meta.next = `${getPermalink(n.slug, false)}${isString(nextFilters) ? nextFilters : ''}`
        }
      }
    }
  }

  /* Page data (props) for layout and actions */

  const pageData = { ...props }

  pageData.id = id
  pageData.parents = parents
  pageData.content = []

  /* Output */

  let layoutOutput = ''

  if (renderFunctions.layout !== undefined) {
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

  if (allData === undefined) {
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

  if (renderFunctions.container === undefined) {
    renderFunctions.container = Container
  }

  if (renderFunctions.column === undefined) {
    renderFunctions.column = Column
  }

  if (renderFunctions.form === undefined) {
    renderFunctions.form = Form
  }

  if (renderFunctions.field === undefined) {
    renderFunctions.field = Field
  }

  if (renderFunctions.richText === undefined) {
    renderFunctions.richText = RichText
  }

  /* Store content data */

  const data: RenderReturn[] = []

  /* Loop through pages first to set parent slugs */

  if (serverlessData === undefined) {
    for (let i = 0; i < content.page.length; i += 1) {
      const item = content.page[i]
      const itemProp = getProp(item, '', {})
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

      const idProp = getProp(item, 'id', '')
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
        const parentSlug = getProp(parent, 'slug')
        const parentTitle = getProp(parent, 'title')
        const parentId = getProp(parent, 'id')

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
        const redirectProp = getProp(r, '', {})

        if (!isObjectStrict(redirectProp)) {
          return
        }

        const { redirect: rr = [] } = redirectProp

        if (!isStringArray(rr)) {
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
      const item: RenderItemReturn = await _renderItem({
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
