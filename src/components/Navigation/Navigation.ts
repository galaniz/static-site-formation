/**
 * Components - Navigation
 */

/* Imports */

import type {
  NavigationProps,
  Navigation as Navigations,
  NavigationItem,
  NavigationBreadcrumbItem,
  NavigationOutputArgs,
  NavigationBreadcrumbOutputArgs
} from './NavigationTypes'
import type { HtmlString } from '../../global/globalTypes'
import {
  getSlug,
  getPermalink,
  getLink,
  getProp,
  isArrayStrict,
  isStringStrict,
  isString,
  isObjectStrict
} from '../../utils'

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

    if (!isObjectStrict(props)) {
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

      if (info !== undefined && isStringStrict(info.id)) {
        this.#itemsById[info.id] = info
      }
    })

    /* Navigations by location */

    this.navigations.forEach(nav => {
      const fields = getProp.self(nav)

      if (!isObjectStrict(fields)) {
        return
      }

      const {
        title = '',
        location = '',
        items = []
      } = fields

      if (isStringStrict(title) && isStringStrict(location) && isArrayStrict(items)) {
        this.#navigationsByLocation[location.toLowerCase().replace(/\s+/g, '')] = {
          title,
          items
        }
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
   * @return {NavigationItem|undefined}
   */
  #getItemInfo (item: NavigationItem): NavigationItem | undefined {
    const fields = getProp.self(item)

    if (!isObjectStrict(fields)) {
      return
    }

    const {
      title = '',
      internalLink,
      externalLink = '',
      children
    } = fields

    let id = isStringStrict(title) ? title : ''
    let external = false

    if (isStringStrict(externalLink)) {
      id = externalLink
      external = true
    }

    const internalId = getProp.id(internalLink)

    if (isStringStrict(internalId)) {
      id = internalId
    }

    const link = getLink(internalLink, externalLink)
    const props: NavigationItem = {
      id,
      title,
      link,
      external
    }

    if (isStringStrict(link) && !external) {
      props.current = props.link === this.current
    }

    let descendentCurrent = false

    if (isArrayStrict(children)) {
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

      if (info === undefined) {
        return
      }

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

    const resItems: NavigationItem[] = []

    items.forEach(item => {
      const fields = getProp.self(item)

      if (!isObjectStrict(fields)) {
        return
      }

      const {
        title = '',
        internalLink,
        externalLink
      } = fields

      let id = ''

      if (isStringStrict(title)) {
        id = title
      }

      if (isStringStrict(externalLink)) {
        id = externalLink
      }

      const internalId = getProp.id(internalLink)

      if (isStringStrict(internalId)) {
        id = internalId
      }

      const storedItem = this.#itemsById[id]

      if (storedItem !== undefined) {
        resItems.push(storedItem)
      }
    })

    return resItems
  }

  /**
   * Loop through items to create html
   *
   * @private
   * @param {NavigationItem[]} items
   * @param {HtmlString} output
   * @param {NavigationOutputArgs} args
   * @param {number} depth
   * @param {number} maxDepth
   * @return {void}
   */
  #recurseOutput = (
    items: NavigationItem[] = [],
    output: HtmlString,
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

    const listClasses = isStringStrict(args.listClass) ? ` class="${args.listClass}"` : ''
    const listAttrs = isStringStrict(args.listAttr) ? ` ${args.listAttr}` : ''

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

      const itemClasses = isStringStrict(args.itemClass) ? ` class="${args.itemClass}"` : ''
      let itemAttrs = isStringStrict(args.itemAttr) ? ` ${args.itemAttr}` : ''

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

      if (isStringStrict(args.linkClass)) {
        linkClassesArray.push(args.linkClass)
      }

      if (!external && isStringStrict(args.internalLinkClass)) {
        linkClassesArray.push(args.internalLinkClass)
      }

      const linkClasses = (linkClassesArray.length > 0) ? ` class="${linkClassesArray.join(' ')}"` : ''
      const linkAttrsArray = [link !== '' ? `href="${link}"` : 'type="button"']

      if (isStringStrict(args.linkAttr)) {
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
    if (this.#navigationsByLocation[location] === undefined) {
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

    const output = { html: '' }

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

    if (!isArrayStrict(items)) {
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

    const listClasses = isStringStrict(args.listClass) ? ` class="${args.listClass}"` : ''
    const listAttrs = isStringStrict(args.listAttr) ? ` ${args.listAttr}` : ''

    /* Loop through items */

    const itemClasses = isStringStrict(args.itemClass) ? ` class="${args.itemClass}"` : ''
    const itemAttrs = isStringStrict(args.itemAttr) ? ` ${args.itemAttr}` : ''
    const lastItemIndex = items.length - 1

    const itemsArray = items.map((item, index) => {
      const { title } = item

      /* Title required */

      if (!isStringStrict(title)) {
        return ''
      }

      /* Permalink required */

      const slug = getSlug({
        id: item.id,
        slug: item.slug,
        contentType: item.contentType,
        linkContentType: item.linkContentType
      })

      const permalink = isString(slug) ? getPermalink(slug) : ''

      if (permalink === '') {
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

      if (isStringStrict(args.linkClass)) {
        linkClassesArray.push(args.linkClass)
      }

      if (isStringStrict(args.internalLinkClass)) {
        linkClassesArray.push(args.internalLinkClass)
      }

      const linkClasses = (linkClassesArray.length > 0) ? ` class="${linkClassesArray.join(' ')}"` : ''
      const linkAttrs = isStringStrict(args.linkAttr) ? ` ${args.linkAttr}` : ''

      output.html += `<a${linkClasses} href="${permalink}"${linkAttrs}>${title}</a>`

      if (typeof args.filterAfterLink === 'function') {
        args.filterAfterLink(filterArgs)
      }

      /* Close item */

      output.html += '</li>'

      return output.html
    })

    /* Output */

    const currentClasses = isStringStrict(args.currentClass) ? ` class="${args.currentClass}"` : ''
    const a11yClasses = isStringStrict(args.a11yClass) ? ` class="${args.a11yClass}"` : ''

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
