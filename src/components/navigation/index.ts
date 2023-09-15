/**
 * Components - navigation
 */

/* Imports */

import getSlug from '../../utils/get-slug'
import getPermalink from '../../utils/get-permalink'
import getLink from '../../utils/get-link'
import getProp from '../../utils/get-prop'

/**
 * Class - recursively generate navigation output
 */

interface NavigationArgs {
  navigations: FRM.Navigation[]
  items: FRM.NavigationItem[]
  current?: string
}

interface NavigationBreadcrumbRecurseArgs extends FRM.NavigationArgs {
  currentClass?: string
  a11yClass?: string
}

class Navigation {
  /**
   * Set properties and initialize
   *
   * @param {object} args
   * @param {object[]} args.navigations
   * @param {object[]} args.items
   * @param {string} args.current
   * @return {void}
   */

  navigations: FRM.Navigation[]
  items: FRM.NavigationItem[]
  current: string
  init: boolean

  #itemsById: { [key: string]: FRM.NavigationItem }
  #navigationsByLocation: { [key: string]: { title: string, items: FRM.NavigationItem[] } }

  constructor (args: NavigationArgs) {
    const {
      navigations = [],
      items = [],
      current = ''
    } = args

    this.navigations = navigations
    this.items = items
    this.current = current

    /**
     * Store items by od
     *
     * @private
     * @type {object}
     */

    this.#itemsById = {}

    /**
     * Store navigations by location
     *
     * @private
     * @type {object}
     */

    this.#navigationsByLocation = {}

    /**
     * Initialize
     *
     * @type {boolean}
     */

    this.init = this.#initialize()
  }

  /**
   * Initialize - check required props and set internal props
   *
   * @private
   * @return {boolean}
   */

  #initialize (): boolean {
    /* Check that required items exist */

    if (this.navigations.length === 0 || this.items.length === 0) {
      return false
    }

    /* Items by id */

    this.items.forEach(item => {
      const info = this.#getItemInfo(item)

      if (info.id !== undefined) {
        this.#itemsById[info.id] = info
      }
    })

    /* Navigations by location */

    this.navigations.forEach(nav => {
      const navFields = Object.assign({
        title: '',
        location: '',
        items: []
      }, getProp(nav, '', {}))

      const { title, location, items } = navFields

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
   * @param {object} item
   * @return {object}
   */

  #getItemInfo (item: FRM.NavigationItem): FRM.NavigationItem {
    const fields = getProp(item, '', {})

    const {
      title = '',
      internalLink,
      externalLink = '',
      children
    } = fields

    let id = title
    let external = false

    const link = getLink(internalLink, externalLink)

    if (externalLink !== '') {
      id = externalLink
      external = true
    }

    if (internalLink !== undefined) {
      id = getProp(internalLink, 'id')
    }

    const props: FRM.NavigationItem = {
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
      const c: FRM.NavigationItem[] = []

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
   * @param {object[]} children
   * @param {object[]} store
   * @return {boolean}
   */

  #recurseItemChildren (children: FRM.NavigationItem[] = [], store: object[] = []): boolean {
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
   * @param {object[]} items
   * @return {object[]}
   */

  #getItems (items: FRM.NavigationItem[] = []): FRM.NavigationItem[] {
    if (items.length === 0) {
      return []
    }

    return items.map(item => {
      const fields = getProp(item, '', {})

      const {
        title = '',
        internalLink,
        externalLink
      } = fields

      let id = title

      if (externalLink !== '' && externalLink !== undefined) {
        id = externalLink
      }

      if (internalLink !== undefined && typeof internalLink === 'object') {
        const internalId = getProp(internalLink, 'id')

        if (internalId !== undefined) {
          id = internalId
        }
      }

      return this.#itemsById[id]
    })
  }

  /**
   * Loop through items to create html
   *
   * @private
   * @param {object[]} items
   * @param {object} output
   * @param {object} args
   * @param {number} depth
   * @param {number} maxDepth
   * @return {void}
   */

  #recurseOutput = (
    items: FRM.NavigationItem[] = [],
    output: { html: string },
    args: FRM.NavigationArgs,
    depth: number = -1,
    maxDepth?: number
  ): void => {
    depth += 1

    if (maxDepth !== undefined && depth > maxDepth) {
      return
    }

    const listFilterArgs: FRM.NavigationListFilterArgs = { args, output, items, depth }

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

      const filterArgs: FRM.NavigationFilterArgs = { args, item, output, index, items, depth }

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
   * @param {object} args
   * @param {number} maxDepth
   * @return {string} HTML - ul
   */

  getOutput (
    location: string = '',
    args: FRM.NavigationArgs,
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
   * @param {object[]} items
   * @param {string} current
   * @param {object} args
   * @return {string} HTML - ol
   */

  getBreadcrumbs (items: FRM.NavigationBreadcrumbItem[] = [], current: string = '', args: NavigationBreadcrumbRecurseArgs): string {
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
      a11yClass: 'a11y-visually-hidden',
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
      const output = { html: '' }
      const isLastLevel = lastItemIndex === index

      /* Filter args */

      const filterArgs: FRM.NavigationBreadcrumbFilterArgs = { output, isLastLevel }

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
        linkContentType: item?.linkContentType
      })

      const permalink = typeof slug === 'string' ? getPermalink(slug) : ''

      output.html += `<a${linkClasses} href="${permalink}"${linkAttrs}>${item.title}</a>`

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

export default Navigation
