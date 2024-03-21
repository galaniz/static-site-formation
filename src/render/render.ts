/**
 * Render
 */

/* Imports */

import type {
  RenderSlugs,
  RenderMetaArgs,
  RenderMetaReturn,
  RenderContentArgs,
  RenderContentData,
  RenderTemplateData,
  RenderServerlessData,
  RenderItemArgs,
  RenderItemReturn,
  RenderItemStartActionArgs,
  RenderItemActionArgs,
  RenderLayoutArgs,
  RenderArgs,
  RenderReturn
} from './renderTypes'
import type {
  ConfigArchiveIds,
  ConfigArchivePosts,
  ConfigSlugParents,
  ConfigTerms,
  ConfigFormMeta,
  ConfigSlugArchives
} from '../config/configTypes'
import type { GenericStrings, ParentArgs, SlugParent } from '../global/globalTypes'
import type { SlugArgs } from '../utils/getSlug/getSlugTypes'
import type { PaginationData } from '../components/Pagination/PaginationTypes'
import type { RichTextContentItem, RichTextHeading } from '../text/RichText/RichTextTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'
import {
  doActions,
  applyFilters,
  getSlug,
  getPermalink,
  getProp,
  getPath,
  getJsonFile,
  isString,
  isStringStrict,
  isArray,
  isArrayStrict,
  isObject,
  isObjectStrict,
  isNumber,
  isFunction,
  getObjectKeys,
  doShortcodes,
  dataSource
} from '../utils/utils'
import { config } from '../config/config'
import { Container } from '../layouts/Container/Container'
import { Column } from '../layouts/Column/Column'
import { Form } from '../objects/Form/Form'
import { Field } from '../objects/Field/Field'
import { RichText } from '../text/RichText/RichText'

/**
 * Store slug data
 *
 * @private
 * @type {import('./RenderTypes').RenderSlugs}
 */
const _slugs: RenderSlugs = {}

/**
 * Function - normalize meta properties into one object
 *
 * @private
 * @param {import('./RenderTypes').RenderMetaArgs} args
 * @return {import('./RenderTypes').RenderMetaReturn}
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
 * @param {import('../components/Pagination/PaginationTypes').PaginationData} args
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
 * Function - set content value from content template based on data source
 *
 * @private
 * @param {import('./RenderTypes').RenderContentData} obj
 * @param {import('./RenderTypes').RenderTemplateData} value
 * @return {void}
 */
const _setContentTemplate = (obj: RenderContentData, value: RenderTemplateData): void => {
  if (dataSource.isContentful() && obj.fields !== undefined) {
    obj.fields.content = value
  }

  obj.content = value
}

/**
 * Function - map out content slots to templates for contentTemplate
 *
 * @private
 * @param {import('./RenderTypes').RenderTemplateData} templates
 * @param {import('./RenderTypes').RenderContentData[]} [content]
 * @return {import('./RenderTypes').RenderTemplateData}
 */
const _mapContentTemplate = (templates: RenderTemplateData, content: RenderContentData[] = []): RenderTemplateData => {
  /* Transform templates */

  if (isArrayStrict(templates)) {
    /* Clone templates */

    templates = templates.map((t) => structuredClone(t))

    /* Recurse cloned template */

    templates.forEach((t, i) => {
      /* Remove template break */

      if (isObjectStrict(getProp.tag(content[0], 'templateBreak')) && content.length >= 1) {
        content.shift()
      }

      /* Check if slot */

      const isSlot = isObjectStrict(getProp.tag(t, 'templateSlot'))

      /* Check for repeatable template item */

      const children = getProp.fields(t, 'content')
      const repeat = getProp.fields(t, 'repeat')

      if (isObjectStrict(repeat) && isArrayStrict(children) && !isSlot) {
        const repeatId = getProp.id(repeat)

        const repeatIndex = children.findIndex((c) => {
          return getProp.id(c) === repeatId
        })

        if (repeatIndex !== -1) {
          let breakIndex = content.findIndex((c) => {
            return isObjectStrict(getProp.tag(c, 'templateBreak'))
          })

          breakIndex = breakIndex === -1 ? content.length : breakIndex

          let insertIndex = repeatIndex

          for (let i = insertIndex; i < breakIndex - 1; i += 1) {
            children.splice(insertIndex, 0, structuredClone(repeat))

            insertIndex = i
          }
        }
      }

      /* Replace slot with content */

      if (isSlot && content.length >= 1) {
        // @ts-expect-error No index signature with a parameter of type 'number' was found on type 'RenderTemplateData'
        templates[i] = content.shift()

        return
      }

      /* Recurse children */

      if (isObject(children)) {
        // @ts-expect-error No index signature with a parameter of type 'number' was found on type 'RenderTemplateData'
        _setContentTemplate(templates[i], _mapContentTemplate(children, content))
      }
    })
  }

  /* Check for nested content */

  if (isObjectStrict(templates)) {
    getObjectKeys(templates).forEach((t) => {
      const template = templates[t]
      // @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'never'
      const children = getProp.fields(template, 'content')

      if (isObject(children)) {
        // @ts-expect-error No index signature with a parameter of type 'string' was found on type 'RenderTemplateData'
        _setContentTemplate(templates[t], _mapContentTemplate(children, content))
      }
    })
  }

  /* Output */

  return templates
}

/**
 * Function - recurse and output nested content
 *
 * @param {import('./RenderTypes').RenderContentArgs} args
 * @return {void}
 */
const renderContent = async (args: RenderContentArgs): Promise<void> => {
  if (!isObject(args)) {
    return
  }

  const {
    contentData = [],
    serverlessData,
    output,
    pageData,
    pageContains = [],
    pageHeadings = [],
    navigations = {},
    renderFunctions = {}
  } = args

  let {
    parents = [],
    headingsIndex = 0,
    depth = 0
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
          parents,
          headings: pageHeadings[headingsIndex]
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
    const props = isObjectStrict(normalProps) ? structuredClone(normalProps) : {}
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

    if (renderType === 'contentTemplate' && isArray(props.templates)) {
      const templates = _mapContentTemplate(props.templates, isArray(props.content) ? props.content : [])

      children = templates
      recurse = true
    }

    /* Render output */

    let renderObj = {
      start: '',
      end: ''
    }

    const renderFunction = renderFunctions[renderType]

    if (isFunction(renderFunction)) {
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

      await renderContent({
        contentData: children,
        serverlessData,
        output,
        parents: parentsCopy,
        pageData,
        pageContains,
        pageHeadings,
        navigations,
        renderFunctions,
        headingsIndex,
        depth: depth += 1
      })
    }

    output.html += end

    /* Additional rich text areas */

    if (renderType === 'content' && depth === 0) {
      headingsIndex = pageHeadings.push([])
    }

    /* Clear parents */

    if (renderType !== '' && renderType !== 'content' && end !== '') {
      parents = []
    }
  }
}

/**
 * Function - output single post or page
 *
 * @param {import('./RenderTypes').RenderItemArgs} args
 * @return {import('./RenderTypes').RenderItemReturn}
 */
const renderItem = async (args: RenderItemArgs): Promise<RenderItemReturn> => {
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

  if (!isObjectStrict(props)) {
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

  /* Store rich text headings in page */

  const pageHeadings: RichTextHeading[][] = [[]]

  /* Start action */

  const renderItemStartArgs: RenderItemStartActionArgs = {
    id,
    pageData: props,
    contentType,
    pageContains,
    pageHeadings,
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

  if (isFunction(renderFunctions.navigations)) {
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
    await renderContent({
      contentData,
      serverlessData: itemServerlessData,
      output: contentOutput,
      parents: [],
      pageData: item,
      pageContains,
      pageHeadings,
      navigations,
      renderFunctions
    })
  }

  contentOutput.html = await doShortcodes(contentOutput.html)

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

  if (isFunction(renderFunctions.layout)) {
    const layoutArgs: RenderLayoutArgs = {
      id,
      meta,
      navigations,
      contentType,
      content: contentOutput.html,
      slug: formattedSlug,
      pageContains,
      pageHeadings,
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
    pageHeadings,
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
    pageHeadings,
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
 * @param {import('./RenderTypes').RenderArgs} args
 * @return {Promise<import('./RenderTypes').RenderReturn[]|import('./RenderTypes').RenderReturn>}
 */
const render = async (args: RenderArgs): Promise<RenderReturn[] | RenderReturn> => {
  /* Fallback output */

  const fallback = [{
    slug: '',
    output: ''
  }]

  /* Props must be object */

  if (!isObjectStrict(args)) {
    return fallback
  }

  const {
    allData,
    serverlessData,
    previewData
  } = args

  /* Start action */

  await doActions('renderStart', args)

  /* Reset script and style directories */

  config.scripts.build = {}
  config.styles.build = {}

  /* Data */

  if (!isObjectStrict(allData)) {
    return fallback
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

      if (isArchive && id !== '') {
        const archiveIds = config.archive.ids
        const archiveSlug = itemProp.slug
        const archiveTitle = itemProp.title
        const contentTypeArchive = config.contentTypes.archive?.[archive]?.id

        if (archiveIds[archive] === undefined) {
          archiveIds[archive] = {}
        }

        archiveIds[archive][linkContentType] = id

        if (isObjectStrict(contentTypeArchive)) {
          contentTypeArchive[linkContentType] = id
        }

        if (isStringStrict(archiveSlug) && isStringStrict(archiveTitle)) {
          config.slug.archives[id] = {
            slug: archiveSlug,
            title: archiveTitle,
            contentType: archive
          }
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
    type NavigationsData = { navigation: Navigation[], navigationItem: NavigationItem[] } | undefined

    const slugParentsData: ConfigSlugParents | undefined = await getJsonFile(getPath('slugParents', 'store'))
    const slugArchivesData: ConfigSlugArchives | undefined = await getJsonFile(getPath('slugArchives', 'store'))
    const archiveIdsData: ConfigArchiveIds | undefined = await getJsonFile(getPath('archiveIds', 'store'))
    const archiveTermsData: ConfigTerms | undefined = await getJsonFile(getPath('archiveTerms', 'store'))
    const archivePostsData: ConfigArchivePosts | undefined = await getJsonFile(getPath('archivePosts', 'store'))
    const formMetaData: ConfigFormMeta | undefined = await getJsonFile(getPath('formMeta', 'store'))
    const navigationsData: NavigationsData = await getJsonFile(getPath('navigations', 'store'))

    if (slugParentsData !== undefined) {
      Object.keys(slugParentsData).forEach((s) => {
        config.slug.parents[s] = slugParentsData[s]
      })
    }

    if (slugArchivesData !== undefined) {
      Object.keys(slugArchivesData).forEach((s) => {
        config.slug.archives[s] = slugArchivesData[s]
      })
    }

    if (archiveIdsData !== undefined) {
      config.archive.ids = archiveIdsData

      Object.keys(archiveIdsData).forEach((a) => {
        if (config.contentTypes.archive[a] != null) {
          config.contentTypes.archive[a].id = archiveIdsData[a]
        }
      })
    }

    if (archiveTermsData !== undefined) {
      config.archive.terms = archiveTermsData
    }

    if (archivePostsData !== undefined) {
      config.archive.posts = archivePostsData
    }

    if (formMetaData !== undefined) {
      config.formMeta = formMetaData
    }

    if (navigationsData !== undefined) {
      config.navigation = navigationsData.navigation
      config.navigationItem = navigationsData.navigationItem
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
      const item = await renderItem({
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
    config.store.files.slugArchives.data = JSON.stringify(config.slug.archives)
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

  const output = serverlessData !== undefined || previewData !== undefined ? data[0] : data

  await doActions('renderEnd', { ...args, data: output })

  return output
}

/* Exports */

export {
  render,
  renderItem,
  renderContent
}
