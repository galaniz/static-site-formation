/**
 * Render
 */

/* Imports */

import { config } from '../config'
import getSlug from '../utils/get-slug'
import getPermalink from '../utils/get-permalink'
import getNormalParam from '../utils/get-normal-param'
import getProp from '../utils/get-prop'
import container from '../layouts/container'
import column from '../layouts/column'
import form from '../objects/form'
import field from '../objects/field'
import richText from '../text/rich'

/**
 * Store slug data for json
 *
 * @type {object}
 */

const _slugs: object = {}

/**
 * Function - normalize meta properties into one object
 *
 * @private
 * @param {object} item
 * @return {object}
 */

interface _MetaReturn {
  title: string
  description: string
  url: string
  image: string
  canonical: string
  prev: string
  next: string
  noIndex: boolean
  isIndex: boolean
}

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
}): _MetaReturn => {
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
 * @param {array<object>} args.contentData
 * @param {object} args.output
 * @param {array<object>} args.parents
 * @param {object} args.renderFunctions
 * @return {void}
 */

interface _RenderFunctions {
  [key: string]: Function
}

interface _ContentChildren {
  nodeType?: string
  content?: any[]
}

interface _ContentArgs {
  contentData: any[]
  serverlessData?: Formation.ServerlessData
  output: {
    html: string
  }
  parents: Array<{
    renderType: string
    props: object
  }>
  pageData: object
  pageContains: string[]
  renderFunctions: _RenderFunctions
}

const _renderContent = async ({
  contentData = [],
  serverlessData,
  output,
  parents = [],
  pageData = {},
  pageContains = [],
  renderFunctions = {}
}: _ContentArgs): Promise<void> => {
  if (Array.isArray(contentData) && (contentData.length > 0)) {
    for (let i = 0; i < contentData.length; i++) {
      let c = contentData[i]

      /* Check for embedded entries and rich text */

      const richTextNode = c?.nodeType

      if (richTextNode !== undefined) {
        if (c.nodeType === 'embedded-entry-block') {
          c = c.data.target
        } else {
          output.html += richText({
            args: {
              tag: richTextNode,
              content: c.content
            },
            parents
          })
        }
      }

      /* Check for nested content */

      let children: _ContentChildren | _ContentChildren[] = c?.content !== undefined ? c.content : []
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

      /* Render and recursion */

      const normalProps = getProp(c)
      const normalRenderType = getProp(c, 'renderType')

      const props: { id?: string, [key: string]: any } = typeof normalProps === 'object' ? normalProps : {}
      const renderType: string = typeof normalRenderType === 'string' ? normalRenderType : ''

      let renderObj = {
        start: '',
        end: ''
      }

      props.id = getProp(c, 'id')

      const renderFunction = renderFunctions[renderType]

      if (typeof renderFunction === 'function') {
        const renderOutput = renderFunction({ args: props, parents })

        if (typeof renderOutput === 'string') {
          renderObj.start = renderOutput
        } else {
          renderObj = renderOutput
        }

        pageContains.push(renderType)
      }

      const start = renderObj.start
      const end = renderObj.end

      output.html += start

      if (Array.isArray(children) && children.length !== 0 && recurse) {
        const parentsCopy = [...parents]

        parentsCopy.unshift({
          renderType,
          props
        })

        await _renderContent({
          contentData: children,
          serverlessData,
          output,
          parents: parentsCopy,
          pageData,
          pageContains,
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

interface _Item {
  id: string
  title: string
  slug: string
  content?: any
  meta?: object
  basePermalink?: string
  [key: string]: any
}

interface _ItemArgs {
  item: _Item
  contentType: string
  serverlessData: Formation.ServerlessData
  renderFunctions: _RenderFunctions
}

interface _ItemReturn {
  serverlessRender: boolean
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
}: _ItemArgs): Promise<_ItemReturn> => {
  /* Serverless render check */

  let serverlessRender = false

  /* Item id */

  const id: string = getProp(item, 'id')

  /* Item props */

  const props: _Item = Object.assign({
    title: '',
    slug: '',
    content: []
  }, getProp(item))

  /* Store components contained in page  */

  const pageContains = []

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

  _slugs[slug !== 'index' && slug !== '' ? `/${slug}/` : '/'] = {
    contentType,
    id
  }

  /* Check if index */

  const index = props.slug === 'index'

  meta.isIndex = index

  /* Main output */

  let output = ''

  /* Content loop */

  const contentOutput = { html: '' }

  let contentData = props.content

  if (contentData?.nodeType !== undefined) {
    contentData = contentData.content
  }

  let itemServerlessData: Formation.ServerlessData | undefined

  if (serverlessData !== undefined) {
    if (serverlessData?.path !== undefined && serverlessData?.query !== undefined) {
      if (serverlessData.path === (slug !== '' ? `/${slug}/` : '/')) {
        itemServerlessData = serverlessData
      } else { // Avoid re-rendering non dynamic pages
        return {
          serverlessRender: false
        }
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
      renderFunctions
    })
  }

  output += contentOutput.html

  /* Prev next pagination - end for pagination update from posts */

  const updatedItem = getProp(item)

  if (updatedItem?.pagination !== undefined) {
    serverlessRender = true

    const pagination = updatedItem.pagination

    const { currentFilters, prevFilters, nextFilters } = pagination

    slugArgs.page = pagination.current > 1 ? pagination.current : 0

    const c = getSlug(slugArgs)

    if (typeof c === 'object') {
      meta.canonical = `${getPermalink(c.slug, pagination.current === 1)}${typeof currentFilters === 'string' ? currentFilters : ''}`
    }

    if (pagination?.prev !== undefined) {
      slugArgs.page = pagination.prev > 1 ? pagination.prev : 0

      const p = getSlug(slugArgs)

      if (typeof p === 'object') {
        meta.prev = `${getPermalink(p.slug, pagination.prev === 1)}${typeof prevFilters === 'string' ? prevFilters : ''}`
      }
    }

    if (pagination?.next !== undefined) {
      if (pagination.next > 1) {
        slugArgs.page = pagination.next

        const n = getSlug(slugArgs)

        if (typeof n === 'object') {
          meta.next = `${getPermalink(n.slug, false)}${typeof nextFilters === 'string' ? nextFilters : ''}`
        }
      }
    }

    meta.title = updatedItem.metaTitle
  }

  /* Output */

  let layoutOutput = ''

  if (renderFunctions?.layout !== undefined) {
    const layoutData = { ...props }

    layoutData.id = id
    layoutData.title = title
    layoutData.parents = parents

    delete layoutData.content

    layoutOutput = await renderFunctions.layout({
      meta,
      navigations: config.navigation,
      navigationItems: config.navigationItem,
      content: output,
      contains: pageContains,
      data: layoutData,
      serverlessData
    })
  }

  return {
    serverlessRender,
    data: {
      slug: slug !== 'index' && slug !== '' ? `/${slug}/` : '/',
      output: layoutOutput
    }
  }
}

/**
 * Function - loop through all content types to output pages and posts
 *
 * @param {object} args
 * @param {object} args.env
 * @param {array<object>} args.allData
 * @param {object} args.serverlessData
 * @param {object} args.previewData
 * @param {function} args.onRenderEnd
 * @return {array|object}
 */

interface RenderArgs {
  env?: {
    dev: boolean
    prod: boolean
  }
  allData: Formation.AllData
  serverlessData: Formation.ServerlessData
  previewData: Formation.PreviewData
  renderFunctions: _RenderFunctions
  onRenderEnd?: Function
}

const render = async ({
  env,
  allData,
  serverlessData,
  previewData,
  renderFunctions = {},
  onRenderEnd
}: RenderArgs): Promise<object[] | object> => {
  /* Set env */

  if (env !== undefined) {
    config.env.dev = env.dev
    config.env.prod = env.prod
  }

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
    content
  } = allData

  /* Store navigations and items */

  config.navigation = navigation
  config.navigationItem = navigationItem

  /* Add formation functions */

  renderFunctions.container = container
  renderFunctions.column = column
  renderFunctions.form = form
  renderFunctions.field = field

  /* Store content data */

  const data: object[] = []

  /* Store routes for render end */

  const serverlessRoutes: string[] = []

  /* Loop through pages first to set parent slugs */

  if (serverlessData === undefined) {
    content.page.forEach(item => {
      let { parent, archive = '' } = getProp(item)

      const id = getProp(item, 'id')

      archive = getNormalParam('contentType', archive)

      if (archive !== '' && id !== '') {
        config.archive.ids[archive] = id

        if (config.archive.posts?.[archive] !== undefined && config.source === 'static') {
          config.archive.posts[archive] = config.archive.posts[archive]
        }

        if (config.slug.bases?.[archive] !== undefined) {
          config.slug.bases[archive].archiveId = id
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
    })
  } else {

  }

  /* 404 page */

  if (serverlessData === undefined && previewData === undefined && renderFunctions?.httpError !== undefined) {
    data.push({
      slug: '404.html',
      output: renderFunctions.httpError('404')
    })
  }

  /* Loop through all content types */

  const contentTypes = Object.keys(content)

  for (let c = 0; c < contentTypes.length; c++) {
    const contentType = contentTypes[c]

    for (let i = 0; i < content[contentType].length; i++) {
      const item: _ItemReturn = await _renderItem({
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
          serverlessRoutes.push(itemData.slug)
        }
      }
    }
  }

  /* Render end callback */

  if (typeof onRenderEnd === 'function') {
    config.store.files.slugs.data = JSON.stringify(_slugs)
    config.store.files.slugParents.data = JSON.stringify()

    config.store.files.navigation.data = JSON.stringify(config.navigation)

    config.navigation

    jsonFileData.slugParents.data = JSON.stringify(slugData.parents)
    jsonFileData.archiveIds.data = JSON.stringify(archiveData.ids)
    jsonFileData.archivePosts.data = JSON.stringify(archiveData.posts)
    jsonFileData.navData.data = JSON.stringify(navData)
    jsonFileData.formMeta.data = JSON.stringify(formMeta)

    onRenderEnd({
      jsonData: jsonFileData,
      serverlessRoutes,
      redirects
    })
  }

  /* Output */

  if (serverlessData !== undefined || previewData !== undefined) {
    return data[0]
  }

  return data
}

/* Exports */

export default render
