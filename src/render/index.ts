/**
 * Render
 */

/* Imports */

import { config } from '../config'
import { doActions } from '../utils/actions'
import getSlug from '../utils/get-slug'
import getPermalink from '../utils/get-permalink'
import getProp from '../utils/get-prop'
import requireFile from '../utils/require-file'
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
  navigations: object
  renderFunctions: _RenderFunctions
}

const _renderContent = async ({
  contentData = [],
  serverlessData,
  output,
  parents = [],
  pageData = {},
  pageContains = [],
  navigations = {},
  renderFunctions = {}
}: _ContentArgs): Promise<void> => {
  if (Array.isArray(contentData) && (contentData.length > 0)) {
    for (let i = 0; i < contentData.length; i += 1) {
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
        const renderOutput = await renderFunction({
          args: props,
          parents,
          pageData,
          pageContains,
          navigations,
          serverlessData
        })

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
  serverlessData?: Formation.ServerlessData
  renderFunctions: _RenderFunctions
}

interface _ItemReturn {
  serverlessRender: boolean
  props?: _Item
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
      navigationItems: config.navigationItem,
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

  let itemServerlessData: Formation.ServerlessData | undefined

  if (serverlessData !== undefined) {
    if (serverlessData?.path !== undefined && serverlessData?.query !== undefined) {
      if (serverlessData.path === formattedSlug) {
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
      navigations,
      renderFunctions
    })
  }

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

  /* Props copy */

  const propsCopy = { ...props }

  propsCopy.id = id
  propsCopy.title = title
  propsCopy.parents = parents

  delete propsCopy.content

  /* Output */

  let layoutOutput = ''

  if (renderFunctions?.layout !== undefined) {
    layoutOutput = await renderFunctions.layout({
      meta,
      navigations: config.navigation,
      navigationItems: config.navigationItem,
      content: contentOutput.html,
      contains: pageContains,
      data: propsCopy,
      serverlessData
    })
  }

  doActions('render', [contentType, formattedSlug, layoutOutput, props])

  return {
    serverlessRender,
    props: propsCopy,
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
 * @param {array<object>} args.allData
 * @param {object} args.serverlessData
 * @param {object} args.previewData
 * @return {array|object}
 */

interface RenderArgs {
  allData?: Formation.AllData
  serverlessData?: Formation.ServerlessData
  previewData?: Formation.PreviewData
}

interface RenderReturn {
  slug: string
  output: string
}

const render = async ({
  allData,
  serverlessData,
  previewData
}: RenderArgs): Promise<RenderReturn[] | RenderReturn> => {
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

  renderFunctions.container = container
  renderFunctions.column = column
  renderFunctions.form = form
  renderFunctions.field = field

  /* Store content data */

  const data: RenderReturn[] = []

  /* Loop through pages first to set parent slugs */

  if (serverlessData === undefined) {
    content.page.forEach(item => {
      let { parent, archive = '' } = getProp(item)

      const id = getProp(item, 'id')

      archive = config.renderTypes?.[archive] !== undefined ? config.renderTypes[archive] : archive

      if (archive !== '' && id !== '') {
        config.archive.ids[archive] = id

        if (allData?.[archive] !== undefined && config.source === 'static') {
          config.archive.posts[archive] = allData[archive]
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

    if (redirect !== undefined && Array.isArray(redirect)) {
      redirect.forEach((r) => {
        const { redirect: rr } = getProp(r)

        if (rr.length > 0) {
          config.redirects.data = config.redirects.data.concat(rr)
        }
      })
    }
  } else {
    const dir = config.store.dir
    const files = config.store.files

    const slugParentsJson = requireFile(`${dir}${files.slugParents.name}`)
    const archiveIdsJson = requireFile(`${dir}${files.archiveIds.name}`)
    const archiveCountsJson = requireFile(`${dir}${files.archiveCounts.name}`)
    const archivePostsJson = requireFile(`${dir}${files.archivePosts.name}`)
    const formMetaJson = requireFile(`${dir}${files.formMeta.name}`)
    const navigationsJson = requireFile(`${dir}${files.navigations.name}`)

    if (slugParentsJson != null) {
      Object.keys(slugParentsJson).forEach((s) => {
        config.slug.parents[s] = slugParentsJson[s]
      })
    }

    if (archiveIdsJson != null) {
      config.archive.ids = archiveIdsJson

      Object.keys(archiveIdsJson).forEach((a) => {
        if (config.slug.bases?.[a] != null) {
          config.slug.bases[a].archiveId = archiveIdsJson[a]
        }
      })
    }

    if (archiveCountsJson != null) {
      config.archive.counts = archiveCountsJson
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

  /* 404 page */

  if (serverlessData === undefined && previewData === undefined && renderFunctions?.httpError !== undefined) {
    data.push({
      slug: '404.html',
      output: renderFunctions.httpError(404)
    })
  }

  /* Loop through all content types */

  const contentTypes = Object.keys(content)

  for (let c = 0; c < contentTypes.length; c += 1) {
    const contentType = contentTypes[c]

    for (let i = 0; i < content[contentType].length; i += 1) {
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
          config.serverless.routes.reload.push({
            path: itemData.slug
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
    config.store.files.archiveCounts.data = JSON.stringify(config.archive.counts)
    config.store.files.archivePosts.data = JSON.stringify(config.archive.posts)
    config.store.files.formMeta.data = JSON.stringify(config.formMeta)
    config.store.files.navigations.data = JSON.stringify({
      navigations: config.navigation,
      navigationItems: config.navigationItem
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
