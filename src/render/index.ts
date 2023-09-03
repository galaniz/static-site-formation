/**
 * Render
 */

/* Imports */

import config from '../config'
import { setActions, doActions } from '../utils/actions'
import { setFilters, applyFilters } from '../utils/filters'
import getSlug from '../utils/get-slug'
import getPermalink from '../utils/get-permalink'
import getProp from '../utils/get-prop'
import container from '../layouts/container'
import column from '../layouts/column'
import form from '../objects/form'
import field from '../objects/field'
import richText from '../text/rich-text'

/**
 * Store slug data for json
 *
 * @type {object}
 */

const _slugs: { [key: string]: { contentType: string, id: string } } = {}

/**
 * Function - normalize meta properties into one object
 *
 * @private
 * @param {object} item
 * @return {object}
 */

const _getMeta = (item: {
  meta?: object
  metaTitle?: string
  metaDescription?: string
  metaImage?: {
    fields?: {
      file?: {
        url?: string
      }
    }
  }
}): FRM.MetaReturn => {
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

  if (item?.meta !== undefined) {
    return Object.assign(meta, item.meta)
  }

  if (item?.metaTitle !== undefined) {
    meta.title = item.metaTitle
  }

  if (item?.metaDescription !== undefined) {
    meta.description = item.metaDescription
  }

  if (item?.metaImage !== undefined) {
    const imageUrl = item.metaImage?.fields?.file?.url

    if (imageUrl !== undefined && typeof imageUrl === 'string') {
      meta.image = `https:${imageUrl}`
    }
  }

  return meta
}

/**
 * Function - recurse and output nested content
 *
 * @private
 * @param {object} args
 * @param {object[]} args.contentData
 * @param {object} args.output
 * @param {object[]} args.parents
 * @param {object} args.renderFunctions
 * @return {void}
 */

interface _RenderFunctions {
  [key: string]: Function
}

interface _RenderContentChildren {
  nodeType?: string
  content?: any[]
}

interface _RenderContentArgs {
  contentData: any[]
  serverlessData?: FRM.ServerlessData
  output: {
    html: string
  }
  parents: FRM.ParentArgs[]
  pageData: FRM.RenderItem
  pageContains: string[]
  navigations: object
  renderFunctions: _RenderFunctions
}

const _renderContent = async ({
  contentData = [],
  serverlessData,
  output,
  parents = [],
  pageData,
  pageContains = [],
  navigations = {},
  renderFunctions = {}
}: _RenderContentArgs): Promise<void> => {
  if (Array.isArray(contentData) && (contentData.length > 0)) {
    for (let i = 0; i < contentData.length; i += 1) {
      let c = contentData[i]

      /* Store html string and filter info */

      let filterType = ''
      let filterArgs = {}
      let richTextOutput = ''

      /* Check for embedded entries and rich text */

      const richTextNode = c?.nodeType

      if (richTextNode !== undefined) {
        if (c.nodeType === 'embedded-entry-block' || c.nodeType === 'embedded-asset-block') {
          c = c.data.target
        } else {
          const richTextArgs = {
            args: {
              type: richTextNode,
              content: c.content
            },
            parents
          }

          richTextOutput = await richText(richTextArgs)
          filterType = 'richText'
          filterArgs = {
            type: richTextNode,
            content: c.content
          }
        }
      }

      /* Check for nested content */

      const contentChildren = getProp(c, 'content')

      let children: _RenderContentChildren | _RenderContentChildren[] = contentChildren !== undefined ? contentChildren : []
      let recurse = false

      if (children !== undefined) {
        if (Array.isArray(children)) {
          if (children.length > 0) {
            recurse = true
          }
        } else {
          if (children?.nodeType !== undefined) {
            if (children?.content !== undefined) {
              children = children.content
            }

            if (Array.isArray(children) && children.length > 0) {
              recurse = true
            }
          }
        }
      }

      /* Render props */

      const normalProps: object = getProp(c, '', {})
      const normalRenderType = getProp(c, 'renderType')

      const props: { id?: string, [key: string]: any } = typeof normalProps === 'object' ? normalProps : {}
      const renderType: string = typeof normalRenderType === 'string' ? normalRenderType : ''

      const id = getProp(c, 'id')

      if (id !== undefined && id !== '') {
        props.id = id
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

        if (typeof renderOutput === 'string') {
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

      const renderContentFilterArgs: FRM.ParentArgs = {
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

      if (Array.isArray(children) && children.length !== 0 && recurse) {
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
}

/**
 * Function - output single post or page
 *
 * @private
 * @param {object} args
 * @param {object} args.item
 * @param {string} args.contentType
 * @return {object}
 */

interface _RenderItemArgs {
  item: FRM.RenderItem
  contentType: string
  serverlessData?: FRM.ServerlessData
  renderFunctions: _RenderFunctions
}

interface _RenderItemReturn {
  serverlessRender: boolean
  pageData?: FRM.RenderItem
  data?: {
    slug: string
    output: string
  }
}

const _renderItem = async ({
  item,
  contentType = 'page',
  serverlessData,
  renderFunctions
}: _RenderItemArgs): Promise<_RenderItemReturn> => {
  /* Serverless render check */

  let serverlessRender = false

  /* Item id */

  const id: string = getProp(item, 'id')

  /* Item props */

  const props: FRM.RenderItem = Object.assign({
    title: '',
    slug: '',
    content: [],
    linkContentType: 'default'
  }, getProp(item, '', {}))

  /* Store components contained in page  */

  const pageContains: string[] = []

  /* Start action */

  const renderItemStartArgs: FRM.RenderItemStartActionArgs = {
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

  if (meta.title === '') {
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
  let parents: object[] = []

  if (typeof s === 'object') {
    slug = s.slug
    parents = s.parents
    permalink = getPermalink(s.slug)
    item.basePermalink = getPermalink(s.slug)
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

  let navigations: object = {}

  if (renderFunctions?.navigations !== undefined) {
    navigations = renderFunctions.navigations({
      navigations: config.navigation,
      items: config.navigationItem,
      current: permalink,
      title,
      parents
    })
  }

  /* Content loop */

  const contentOutput = { html: '' }

  let contentData = props.content

  if (contentData?.nodeType !== undefined) {
    contentData = contentData.content
  }

  let itemServerlessData: FRM.ServerlessData | undefined

  if (serverlessData !== undefined) {
    const serverlessPath = serverlessData.path !== undefined ? serverlessData.path : ''

    if (serverlessPath === formattedSlug && serverlessData?.query !== undefined) {
      itemServerlessData = serverlessData
    } else { // Avoid re-rendering non dynamic pages
      return {
        serverlessRender: false
      }
    }
  }

  if (Array.isArray(contentData) && contentData.length > 0) {
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

  if (item.pagination !== undefined) {
    serverlessRender = true

    const pagination = item.pagination

    const {
      currentFilters,
      prevFilters,
      nextFilters
    } = pagination

    slugArgs.page = pagination.current > 1 ? pagination.current : 0

    const c = getSlug(slugArgs)

    if (typeof c === 'object') {
      meta.canonical = `${getPermalink(c.slug, pagination.current === 1)}${typeof currentFilters === 'string' ? currentFilters : ''}`
    }

    if (pagination.title !== undefined) {
      meta.paginationTitle = pagination.title
    }

    if (pagination.prev !== undefined) {
      slugArgs.page = pagination.prev > 1 ? pagination.prev : 0

      const p = getSlug(slugArgs)

      if (typeof p === 'object') {
        meta.prev = `${getPermalink(p.slug, pagination.prev === 1)}${typeof prevFilters === 'string' ? prevFilters : ''}`
      }
    }

    if (pagination.next !== undefined) {
      if (pagination.next > 1) {
        slugArgs.page = pagination.next

        const n = getSlug(slugArgs)

        if (typeof n === 'object') {
          meta.next = `${getPermalink(n.slug, false)}${typeof nextFilters === 'string' ? nextFilters : ''}`
        }
      }
    }
  }

  /* Page data (props) for layout and actions */

  const pageData = { ...props }

  pageData.id = id
  pageData.parents = parents
  pageData.content = undefined

  /* Output */

  let layoutOutput = ''

  if (renderFunctions?.layout !== undefined) {
    const layoutArgs: FRM.LayoutArgs = {
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

  const renderItemFilterArgs: FRM.RenderItemFilterArgs = {
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

  const renderItemEndArgs: FRM.RenderItemEndActionArgs = {
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
 * @param {object} args
 * @param {object[]} args.allData
 * @param {object} args.serverlessData
 * @param {object} args.previewData
 * @return {array|object}
 */

interface RenderArgs {
  allData?: FRM.AllData
  serverlessData?: FRM.ServerlessData
  previewData?: FRM.PreviewData
}

const render = async ({
  allData,
  serverlessData,
  previewData
}: RenderArgs): Promise<FRM.RenderReturn[] | FRM.RenderReturn> => {
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
    renderFunctions.container = container
  }

  if (renderFunctions.column === undefined) {
    renderFunctions.column = column
  }

  if (renderFunctions.form === undefined) {
    renderFunctions.form = form
  }

  if (renderFunctions.field === undefined) {
    renderFunctions.field = field
  }

  if (renderFunctions.richText === undefined) {
    renderFunctions.richText = richText
  }

  /* Store content data */

  const data: FRM.RenderReturn[] = []

  /* Loop through pages first to set parent slugs */

  if (serverlessData === undefined) {
    for (let i = 0; i < content.page.length; i += 1) {
      const item = content.page[i]
      const itemData: { parent: object, archive: string, linkContentType: string } = getProp(item, '', {})

      let { parent, archive = '', linkContentType = 'default' } = itemData

      archive = await applyFilters('renderArchiveName', archive)
      linkContentType = await applyFilters('renderLinkContentTypeName', linkContentType)

      const id = getProp(item, 'id')
      const isArchive = archive !== '' && id !== ''

      if (isArchive) {
        const archiveIds = config.archive.ids
        const contentTypeArchive = config.contentTypes.archive?.[archive]?.id

        if (archiveIds[archive] === undefined) {
          archiveIds[archive] = {}
        }

        archiveIds[archive][linkContentType] = id

        if (contentTypeArchive !== undefined && typeof contentTypeArchive === 'object') {
          contentTypeArchive[linkContentType] = id
        }
      }

      if (parent !== undefined && id !== '') {
        const parentSlug = getProp(parent, 'slug')
        const parentTitle = getProp(parent, 'title')
        const parentId = getProp(parent, 'id')

        if (parentSlug !== undefined && parentTitle !== undefined && parentId !== undefined) {
          config.slug.parents[id] = {
            id: parentId,
            slug: parentSlug,
            title: parentTitle,
            contentType: 'page'
          }
        }
      }
    }

    if (redirect !== undefined && Array.isArray(redirect)) {
      redirect.forEach((r) => {
        const { redirect: rr = [] } = getProp(r, '', {})

        if (rr.length > 0) {
          config.redirects.data = config.redirects.data.concat(rr)
        }
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
        if (config.contentTypes.archive?.[a] != null) {
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
      const item: _RenderItemReturn = await _renderItem({
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

export default render
