/**
 * Render
 */

/* Imports */

import { PurgeCSS } from 'purgecss'
import { getSlug, getPermalink } from '../utils'
import { slugData, envData, navData, archiveData, formMeta, jsonFileData } from '../vars/data'
import getAllData from '../utils/get-all-data'
import layout from './layout'
import header from './header'
import footer from './footer'
import button from './button'
import container from './container'
import column from './column'
import form from './form'
import field from './field'
import richText from './rich-text'
import image from './image'
import video from './video'
import waveSeparator from './wave-separator'
import navigations, { navContainer } from './navigations'
import hero from './hero'
import httpError from './http-error'
import aspectRatio from './aspect-ratio'
import posts from './posts'
import singleContent from './single-content'
import termContent from './term-content'
import { card } from './cards'

/**
 * Store slug data for json
 *
 * @type {object}
 */

const _slugs: object = {}

/**
 * Function - recurse and output nested content
 *
 * @private
 * @param {object} args
 * @param {array<object>} args.contentData
 * @param {object} args.output
 * @param {array<object>} args.parents
 * @param {object} args.navs
 * @return {void}
 */

interface _ContentArgs {
  contentData: any[]
  output: {
    html: string
  }
  parents: Array<{
    renderType: string
    props: object
  }>
  navs: object
}

const _renderContent = async ({
  contentData = [],
  output,
  parents = [],
  navs
}: _ContentArgs): Promise<void> => {
  if (Array.isArray(contentData) && (contentData.length > 0)) {
    for (let i = 0; i < contentData.length; i++) {
      const c = contentData[i]

      /* Check for nested content */

      const children: object[] = c?.content !== undefined ? c.content : []
      let recurse = false

      if (children !== undefined) {
        if (Array.isArray(children)) {
          if (children.length > 0) {
            recurse = true
          }
        }
      }

      /* Render and recursion */

      const props: object = typeof c === 'object' ? c : {}
      const renderType: string = typeof c.renderType === 'string' ? c.renderType : ''

      let renderObj = {
        start: '',
        end: ''
      }

      switch (renderType) {
        case 'column':
          renderObj = column({ args: props, parents })
          break
        case 'container':
          renderObj = container({ args: props, parents })
          break
        case 'aspect-ratio':
          renderObj = aspectRatio({ args: props, parents })
          break
        case 'card':
          renderObj = card({ args: props, parents })
          break
        case 'form':
          renderObj = form({ args: props })
          break
        case 'field':
          renderObj.start = field({ args: props })
          break
        case 'rich-text':
          renderObj.start = richText({ args: props, parents })
          break
        case 'image':
          renderObj.start = image({ args: props, parents })
          break
        case 'button':
          renderObj.start = button({ args: props, parents })
          break
        case 'video':
          renderObj.start = video({ args: props, parents })
          break
        case 'wave-separator':
          renderObj.start = waveSeparator()
          break
        case 'posts':
          renderObj.start = posts({ args: props, parents })
          break
        case 'navigation': {
          renderObj.start = navContainer({ navs, props })
          break
        }
      }

      const start = renderObj.start
      const end = renderObj.end

      output.html += start

      if (children.length !== 0 && recurse) {
        const parentsCopy = [...parents]

        parentsCopy.unshift({
          renderType,
          props
        })

        await _renderContent({
          contentData: children,
          output,
          parents: parentsCopy,
          navs
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

interface _ItemArgs {
  item: {
    id: string
    basePermalink?: string
  }
  contentType: string
}

interface _ItemReturn {
  data: {
    slug: string
    output: string
  }
}

const _renderItem = async ({
  item,
  contentType = 'page'
}: _ItemArgs): Promise<_ItemReturn> => {
  /* Item id */

  const id = item.id

  /* Item props */

  const props = Object.assign({
    title: '',
    slug: '',
    archive: '',
    hero: {},
    content: [],
    meta: {
      title: '',
      canonical: '',
      url: '',
      isIndex: false
    },
    passwordProtected: false,
    theme: {},
    svg: false,
    related: []
  }, item)

  /* Meta */

  const title = props.title
  const meta = props.meta

  if (meta?.title === undefined || meta?.title === '') {
    meta.title = title
  }

  /* Permalink */

  const slugArgs = {
    id,
    contentType,
    slug: props.slug,
    returnParents: true
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

  /* Navigations */

  const navsOutput = navigations({
    navs: navData.navs,
    items: navData.items,
    current: permalink,
    title,
    parents
  })

  /* Hero */

  const heroArgs: Render.HeroArgs = {
    contentType,
    archive: props.archive,
    ...props.hero
  }

  if (props.slug === 'index') {
    heroArgs.type = 'index'
  }

  if (heroArgs.title === undefined) {
    heroArgs.title = title
  }

  const heroOutput = hero(heroArgs)

  /* Main output */

  let output = ''

  /* Content loop */

  const contentOutput = { html: '' }
  const contentData = props.content

  if (Array.isArray(contentData) && contentData.length > 0) {
    await _renderContent({
      contentData,
      output: contentOutput,
      parents: [],
      navs: navsOutput
    })
  }

  if (props.related.length > 0) {
    const s = singleContent({
      contentType,
      related: props.related
    })

    if (s !== '') {
      contentOutput.html += s
    }
  }

  if (contentType === 'workCategory') {
    contentOutput.html += termContent(contentType, id)
  }

  output += contentOutput.html

  /* Style */

  let style = ''

  if (Object.keys(props.theme).length !== 0) {
    const styleArray: string[] = []

    Object.keys(props.theme).forEach((t) => {
      const prefix = t.includes('video') ? '' : 'theme-'
      const color = props.theme[t]?.dark !== undefined ? props.theme[t].dark : props.theme[t]

      if (typeof color === 'string') {
        styleArray.push(`--${prefix}${t}:${color}`)
      }
    })

    style = `:root{${styleArray.join(';')};--main-button-bg:var(--theme-main)}`
  }

  /* Output */

  const layoutOutput = await layout({
    meta,
    content: `
      ${header(navsOutput)}
      <main id="main">
        ${heroOutput}
        ${output}
      </main>
      ${footer(navsOutput)}
    `,
    style,
    PurgeCSS
  })

  return {
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
 * @param {function} args.onRenderEnd
 * @return {array|object}
 */

interface RenderArgs {
  env?: {
    dev: boolean
    prod: boolean
  }
  onRenderEnd?: Function
}

const render = async ({ env, onRenderEnd }: RenderArgs): Promise<object[]> => {
  /* Set env */

  if (env !== undefined) {
    envData.dev = env.dev
    envData.prod = env.prod
  }

  /* All data */

  const allData = await getAllData('init_all_data')

  if (allData == null) {
    return [{
      slug: '',
      output: ''
    }]
  }

  const {
    content,
    navs,
    navItems,
    redirects,
    archivePosts
  } = allData

  /* Store navigations and items */

  navData.navs = navs
  navData.items = navItems

  /* Store content data */

  const data: object[] = []

  /* Store routes for render end */

  const serverlessRoutes: string[] = []

  /* Loop through pages first to set parent slugs */

  content.page.forEach(item => {
    const { parent, id = '', archive = '' } = item

    if (archive !== '' && id !== '') {
      archiveData.ids[archive] = id

      if (archivePosts?.[archive] !== undefined) {
        archiveData.posts[archive] = archivePosts[archive]
      }

      if (slugData.bases?.[archive] !== undefined) {
        slugData.bases[archive].archiveId = id
      }
    }

    if (parent !== undefined && id !== '') {
      if (parent.slug !== undefined && parent.title !== undefined) {
        slugData.parents[id] = {
          id: parent.id,
          slug: parent.slug,
          title: parent.title,
          contentType: 'page'
        }
      }
    }
  })

  /* 404 page */

  data.push({
    slug: '404.html',
    output: await httpError('404')
  })

  /* Loop through all content types */

  const contentTypes = Object.keys(content)

  for (let c = 0; c < contentTypes.length; c++) {
    const contentType = contentTypes[c]

    for (let i = 0; i < content[contentType].length; i++) {
      const itemObj = content[contentType][i]
      const { passwordProtected = false } = itemObj

      const item: _ItemReturn = await _renderItem({
        item: itemObj,
        contentType
      })

      data.push(item.data)

      if (passwordProtected === true) {
        serverlessRoutes.push(item.data.slug)
      }
    }
  }

  /* Render end callback */

  if (typeof onRenderEnd === 'function') {
    jsonFileData.slugs.data = JSON.stringify(_slugs)
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

  return data
}

/* Exports */

export default render
