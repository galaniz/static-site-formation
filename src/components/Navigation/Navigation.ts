/**
 * Components - Navigation
 */

/* Imports */

import type { InternalLink, Generic } from '../../global/types/types'
import {
  getSlug,
  getPermalink,
  getLink,
  getProp,
  isObject,
  isArrayStrict,
  isStringStrict,
  isString,
  isObjectStrict
} from '../../utils'

/**
 * @typedef {object} NavigationProps
 * @prop {Navigations[]} navigations
 * @prop {NavigationItem[]} items
 * @prop {string} [current]
 */
export interface NavigationProps {
  navigations: Navigations[]
  items: NavigationItem[]
  current?: string
}

/**
 * @typedef Navigations
 * @type {Generic}
 * @prop {string} [title]
 * @prop {string} location
 * @prop {NavigationItem[]} items
 */
export interface Navigations extends Generic {
  title?: string
  location: string
  items: NavigationItem[]
}

/**
 * @typedef NavigationItem
 * @type {Generic}
 * @prop {string} [id]
 * @prop {string} [title]
 * @prop {string} [link]
 * @prop {InternalLink} [internalLink]
 * @prop {string} [externalLink]
 * @prop {NavigationItem[]} [children]
 * @prop {boolean} [current]
 * @prop {boolean} [external]
 * @prop {boolean} [descendentCurrent]
 */
export interface NavigationItem extends Generic {
  id?: string
  title?: string
  link?: string
  internalLink?: InternalLink
  externalLink?: string
  children?: NavigationItem[]
  current?: boolean
  external?: boolean
  descendentCurrent?: boolean
}

/**
 * @typedef NavigationBreadcrumbItem
 * @type NavigationItem
 * @prop {string} slug
 * @prop {string} contentType
 */
export interface NavigationBreadcrumbItem extends NavigationItem {
  slug: string
  contentType: string
}

/**
 * @typedef {object} NavigationOutputBaseArgs
 * @prop {string} [listClass]
 * @prop {string} [listAttr]
 * @prop {string} [itemClass]
 * @prop {string} [itemAttr]
 * @prop {string} [linkClass]
 * @prop {string} [internalLinkClass]
 * @prop {string} [linkAttr]
 */
interface NavigationOutputBaseArgs {
  listClass?: string
  listAttr?: string
  itemClass?: string
  itemAttr?: string
  linkClass?: string
  internalLinkClass?: string
  linkAttr?: string
}

/**
 * @typedef {object} NavigationOutputListFilterArgs
 * @prop {NavigationOutputArgs} args
 * @prop {object} output
 * @prop {string} output.html
 * @prop {NavigationItem[]} items
 * @prop {number} depth
 */
interface NavigationOutputListFilterArgs {
  args: NavigationOutputArgs
  output: {
    html: string
  }
  items: NavigationItem[]
  depth: number
}

/**
 * @typedef {object} NavigationOutputFilterArgs
 * @prop {NavigationOutputArgs} args
 * @prop {NavigationItem} item
 * @prop {object} output
 * @prop {string} output.html
 * @prop {number} index
 * @prop {NavigationItem[]} items
 * @prop {number} depth
 */
interface NavigationOutputFilterArgs {
  args: NavigationOutputArgs
  item: NavigationItem
  output: {
    html: string
  }
  index: number
  items: NavigationItem[]
  depth: number
}

/**
 * @typedef {Function} NavigationOutputListFilter
 * @param {NavigationOutputListFilterArgs} args
 * @return {void}
 */
type NavigationOutputListFilter = (args: NavigationOutputListFilterArgs) => void

/**
 * @typedef {Function} NavigationFilter
 * @param {NavigationOutputFilterArgs} args
 * @return {void}
 */
type NavigationFilter = (args: NavigationOutputFilterArgs) => void

/**
 * @typedef NavigationOutputArgs
 * @type NavigationOutputBaseArgs
 * @prop {NavigationOutputListFilter} [filterBeforeList]
 * @prop {NavigationOutputListFilter} [filterAfterList]
 * @prop {NavigationFilter} [filterBeforeItem]
 * @prop {NavigationFilter} [filterAfterItem]
 * @prop {NavigationFilter} [filterBeforeLink]
 * @prop {NavigationFilter} [filterAfterLink]
 * @prop {NavigationFilter} [filterBeforeLinkText]
 * @prop {NavigationFilter} [filterAfterLinkText]
 */
interface NavigationOutputArgs extends NavigationOutputBaseArgs {
  filterBeforeList?: NavigationOutputListFilter
  filterAfterList?: NavigationOutputListFilter
  filterBeforeItem?: NavigationFilter
  filterAfterItem?: NavigationFilter
  filterBeforeLink?: NavigationFilter
  filterAfterLink?: NavigationFilter
  filterBeforeLinkText?: NavigationFilter
  filterAfterLinkText?: NavigationFilter
}

/**
 * @typedef {object} NavigationBreadcrumbOutputFilterArgs
 * @prop {object} output
 * @prop {string} output.html
 * @prop {boolean} isLastLevel
 */
interface NavigationBreadcrumbOutputFilterArgs {
  output: {
    html: string
  }
  isLastLevel: boolean
}

/**
 * @typedef {Function} NavigationBreadcrumbOutputFilter
 * @param {NavigationBreadcrumbOutputFilterArgs} args
 * @return {void}
 */
type NavigationBreadcrumbOutputFilter = (args: NavigationBreadcrumbOutputFilterArgs) => void

/**
 * @typedef NavigationBreadcrumbOutputArgs
 * @type {NavigationOutputBaseArgs}
 * @prop {string} [currentClass]
 * @prop {string} [a11yClass]
 * @prop {NavigationBreadcrumbOutputFilter} [filterBeforeLink]
 * @prop {NavigationBreadcrumbOutputFilter} [filterAfterLink]
 */
interface NavigationBreadcrumbOutputArgs extends NavigationOutputBaseArgs {
  currentClass?: string
  a11yClass?: string
  filterBeforeLink?: NavigationBreadcrumbOutputFilter
  filterAfterLink?: NavigationBreadcrumbOutputFilter
}

/**
 * Class - recursively generate navigation output
 */
class Navigation {
  /**
   * Store all navigations
   *
   * @type {Navigations[]}
   */
  navigations: Navigations[] = []

  /**
   * Store all navigation items
   *
   * @type {NavigationItem[]}
   */
  items: NavigationItem[] = []

  /**
   * Current link to compare against
   *
   * @type {string}
   */
  current: string = ''

  /**
   * Store initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Store navigation items by id
   *
   * @private
   * @type {Object.<string, NavigationItem>}
   */
  #itemsById: {
    [key: string]: NavigationItem
  } = {}

  /**
   * Store navigations by location
   *
   * @private
   * @type {object}
   */
  #navigationsByLocation: {
    [key: string]: {
      title: string
      items: NavigationItem[]
    }
  } = {}

  /**
   * Set properties and initialize
   *
   * @param {NavigationProps} props
   */
  constructor (props: NavigationProps) {
    this.init = this.#initialize(props)
  }

  /**
   * Initialize - check required props and set props
   *
   * @private
   * @param {NavigationProps} props
   * @return {boolean}
   */
  #initialize (props: NavigationProps): boolean {
    /* Check props is object */

    if (!isObject(props)) {
      return false
    }

    /* Defaults */

    const {
      navigations = [],
      items = [],
      current = ''
    } = props

    /* Check that required items exist */

    if (!isArrayStrict(navigations) || !isArrayStrict(items)) {
      return false
    }

    /* Set variables */

    this.navigations = navigations
    this.items = items
    this.current = current

    /* Items by id */

    this.items.forEach(item => {
      const info = this.#getItemInfo(item)

      if (info.id !== undefined) {
        this.#itemsById[info.id] = info
      }
    })

    /* Navigations by location */

    this.navigations.forEach(nav => {
      const navFields = getProp(nav, '', {}) as Navigations

      if (!isObjectStrict(navFields)) {
        return
      }

      const {
        title = '',
        location = '',
        items = []
      } = navFields

      this.#navigationsByLocation[location.toLowerCase().replace(/ /g, '')] = {
        title,
        items
      }
    })

    /* Init successful */

    return true
  }

  /**
   * Normalize navigation item props
   *
   * @private
   * @param {NavigationItem} item
   * @return {NavigationItem}
   */
  #getItemInfo (item: NavigationItem): NavigationItem {
    const fields = getProp(item, '', {}) as NavigationItem

    const {
      title = '',
      internalLink,
      externalLink = '',
      children
    } = fields

    let id = title
    let external = false

    const link = getLink(internalLink, externalLink)

    if (isStringStrict(externalLink)) {
      id = externalLink
      external = true
    }

    if (internalLink !== undefined) {
      const idProp = getProp(internalLink, 'id')

      if (isStringStrict(idProp)) {
        id = idProp
      }
    }

    const props: NavigationItem = {
      id,
      title,
      link,
      external
    }

    if (link !== undefined && internalLink !== undefined) {
      props.current = props.link === this.current
    }

    let descendentCurrent = false

    if (children !== undefined) {
      const c: NavigationItem[] = []

      descendentCurrent = this.#recurseItemChildren(children, c)

      props.children = c
    }

    if (descendentCurrent) {
      props.descendentCurrent = descendentCurrent
    }

    Object.keys(fields).forEach((f) => {
      if (props[f] === undefined) {
        props[f] = fields[f]
      }
    })

    return props
  }

  /**
   * Loop through items to check and set children
   *
   * @private
   * @param {NavigationItem[]} children
   * @param {NavigationItem[]} store
   * @return {boolean}
   */
  #recurseItemChildren (
    children: NavigationItem[] = [],
    store: NavigationItem[] = []
  ): boolean {
    let childCurrent = false

    children.forEach(child => {
      const info = this.#getItemInfo(child)

      const { current = false } = info

      if (current) {
        childCurrent = true
      }

      store.push(info)
    })

    return childCurrent
  }

  /**
   * Return navigation items by id
   *
   * @private
   * @param {NavigationItem[]} items
   * @return {NavigationItem[]}
   */
  #getItems (items: NavigationItem[] = []): NavigationItem[] {
    if (items.length === 0) {
      return []
    }

    return items.map(item => {
      const fields = getProp(item, '', {}) as NavigationItem

      const {
        title = '',
        internalLink,
        externalLink
      } = fields

      let id = title

      if (isStringStrict(externalLink)) {
        id = externalLink
      }

      if (isObject(internalLink)) {
        const idProp = getProp(internalLink, 'id')

        if (isStringStrict(idProp)) {
          id = idProp
        }
      }

      return this.#itemsById[id]
    })
  }

  /**
   * Loop through items to create html
   *
   * @private
   * @param {NavigationItem[]} items
   * @param {object} output
   * @param {string} output.html
   * @param {NavigationOutputArgs} args
   * @param {number} depth
   * @param {number} maxDepth
   * @return {void}
   */
  #recurseOutput = (
    items: NavigationItem[] = [],
    output: { html: string },
    args: NavigationOutputArgs,
    depth: number = -1,
    maxDepth?: number
  ): void => {
    depth += 1

    if (maxDepth !== undefined && depth > maxDepth) {
      return
    }

    const listFilterArgs = { args, output, items, depth }

    if (typeof args.filterBeforeList === 'function') {
      args.filterBeforeList(listFilterArgs)
    }

    const listClasses = args.listClass !== undefined ? ` class="${args.listClass}"` : ''
    const listAttrs = args.listAttr !== undefined ? ` ${args.listAttr}` : ''

    output.html += `<ul data-depth="${depth}"${listClasses}${listAttrs}>`

    items.forEach((item, index) => {
      const {
        title = '',
        link = '',
        external = false,
        children = [],
        current = false,
        descendentCurrent = false
      } = item

      /* Filters args */

      const filterArgs = { args, item, output, index, items, depth }

      /* Item start */

      if (typeof args.filterBeforeItem === 'function') {
        args.filterBeforeItem(filterArgs)
      }

      const itemClasses = args.itemClass !== undefined ? ` class="${args.itemClass}"` : ''
      let itemAttrs = args.itemAttr !== undefined ? ` ${args.itemAttr}` : ''

      if (current) {
        itemAttrs += ' data-current="true"'
      }

      if (descendentCurrent) {
        itemAttrs += ' data-descendent-current="true"'
      }

      output.html += `<li data-depth="${depth}"${itemClasses}${itemAttrs}>`

      /* Link start */

      if (typeof args.filterBeforeLink === 'function') {
        args.filterBeforeLink(filterArgs)
      }

      const linkClassesArray: string[] = []

      if (args.linkClass !== undefined) {
        linkClassesArray.push(args.linkClass)
      }

      if (!external && args.internalLinkClass !== undefined) {
        linkClassesArray.push(args.internalLinkClass)
      }

      const linkClasses = (linkClassesArray.length > 0) ? ` class="${linkClassesArray.join(' ')}"` : ''

      const linkAttrsArray = [link !== '' ? `href="${link}"` : 'type="button"']

      if (args.linkAttr !== undefined) {
        linkAttrsArray.push(args.linkAttr)
      }

      if (current) {
        linkAttrsArray.push('data-current="true"')

        if (link !== '') {
          linkAttrsArray.push('aria-current="page"')
        }
      }

      if (descendentCurrent) {
        linkAttrsArray.push('data-descendent-current="true"')
      }

      const linkAttrs = (linkAttrsArray.length > 0) ? ` ${linkAttrsArray.join(' ')}` : ''

      const linkTag = link !== '' ? 'a' : 'button'

      output.html += `<${linkTag} data-depth="${depth}"${linkClasses}${linkAttrs}>`

      if (typeof args.filterBeforeLinkText === 'function') {
        args.filterBeforeLinkText(filterArgs)
      }

      output.html += title

      if (typeof args.filterAfterLinkText === 'function') {
        args.filterAfterLinkText(filterArgs)
      }

      /* Link end */

      output.html += `</${linkTag}>`

      if (typeof args.filterAfterLink === 'function') {
        args.filterAfterLink(filterArgs)
      }

      /* Nested content */

      if (children.length > 0) {
        this.#recurseOutput(children, output, args, depth, maxDepth)
      }

      /* Item end */

      output.html += '</li>'

      if (typeof args.filterAfterItem === 'function') {
        args.filterAfterItem(filterArgs)
      }
    })

    output.html += '</ul>'

    if (typeof args.filterAfterList === 'function') {
      args.filterAfterList(listFilterArgs)
    }
  }

  /**
   * Return navigation html output
   *
   * @param {string} location
   * @param {NavigationOutputArgs} args
   * @param {number} maxDepth
   * @return {string} HTML - ul
   */
  getOutput (
    location: string = '',
    args: NavigationOutputArgs,
    maxDepth?: number
  ): string {
    if (this.#navigationsByLocation?.[location] === undefined) {
      return ''
    }

    const items = this.#navigationsByLocation[location].items
    const normalizedItems = this.#getItems(items)

    args = Object.assign({
      listClass: '',
      listAttr: '',
      itemClass: '',
      itemAttr: '',
      linkClass: '',
      internalLinkClass: '',
      linkAttr: '',
      filterBeforeList: () => {},
      filterAfterList: () => {},
      filterBeforeItem: () => {},
      filterAfterItem: () => {},
      filterBeforeLink: () => {},
      filterAfterLink: () => {},
      filterBeforeLinkText: () => {},
      filterAfterLinkText: () => {}
    }, args)

    const output = {
      html: ''
    }

    this.#recurseOutput(normalizedItems, output, args, -1, maxDepth)

    return output.html
  }

  /**
   * Return breadcrumbs html output
   *
   * @param {NavigationBreadcrumbItem[]} items
   * @param {string} current
   * @param {NavigationBreadcrumbOutputArgs} args
   * @return {string} HTML - ol
   */
  getBreadcrumbs (
    items: NavigationBreadcrumbItem[] = [],
    current: string = '',
    args: NavigationBreadcrumbOutputArgs
  ): string {
    /* Items required */

    if (items.length === 0) {
      return ''
    }

    /* Args defaults */

    args = Object.assign({
      listClass: '',
      listAttr: '',
      itemClass: '',
      itemAttr: '',
      linkClass: '',
      internalLinkClass: '',
      linkAttr: '',
      currentClass: '',
      a11yClass: 'a-visually-hidden',
      filterBeforeLink: () => {},
      filterAfterLink: () => {}
    }, args)

    /* List attributes */

    const listClasses = args.listClass !== undefined ? ` class="${args.listClass}"` : ''
    const listAttrs = args.listAttr !== undefined ? ` ${args.listAttr}` : ''

    /* Loop through items */

    const itemClasses = args.itemClass !== undefined ? ` class="${args.itemClass}"` : ''
    const itemAttrs = args.itemAttr !== undefined ? ` ${args.itemAttr}` : ''
    const lastItemIndex = items.length - 1

    const itemsArray = items.map((item, index) => {
      const { title } = item

      /* Title required */

      if (!isStringStrict(title)) {
        return ''
      }

      /* Output store */

      const output = { html: '' }

      /* Check if last */

      const isLastLevel = lastItemIndex === index

      /* Filter args */

      const filterArgs = { output, isLastLevel }

      /* Item */

      output.html += `<li${itemClasses}${itemAttrs} data-last-level="${isLastLevel.toString()}">`

      /* Link */

      if (typeof args.filterBeforeLink === 'function') {
        args.filterBeforeLink(filterArgs)
      }

      const linkClassesArray: string[] = []

      if (args.linkClass !== undefined) {
        linkClassesArray.push(args.linkClass)
      }

      if (args.internalLinkClass !== undefined) {
        linkClassesArray.push(args.internalLinkClass)
      }

      const linkClasses = (linkClassesArray.length > 0) ? ` class="${linkClassesArray.join(' ')}"` : ''

      const linkAttrs = args.linkAttr !== undefined ? ` ${args.linkAttr}` : ''

      const slug = getSlug({
        id: item.id,
        slug: item.slug,
        contentType: item.contentType,
        linkContentType: isStringStrict(item.linkContentType) ? item.linkContentType : undefined
      })

      const permalink = isString(slug) ? getPermalink(slug) : ''

      output.html += `<a${linkClasses} href="${permalink}"${linkAttrs}>${title}</a>`

      if (typeof args.filterAfterLink === 'function') {
        args.filterAfterLink(filterArgs)
      }

      /* Close item */

      output.html += '</li>'

      return output.html
    })

    /* Output */

    const currentClasses = args.currentClass !== undefined ? ` class="${args.currentClass}"` : ''
    const a11yClasses = args.a11yClass !== undefined ? ` class="${args.a11yClass}"` : ''

    return `
      <ol${listClasses}${listAttrs}>
        ${itemsArray.join('')}
        <li${itemClasses}${itemAttrs} data-current="true">
          <span${currentClasses}>${current}<span${a11yClasses}> (current page)</span></span>
        </li>
      </ol>
    `
  }
}

/* Exports */

export { Navigation }
