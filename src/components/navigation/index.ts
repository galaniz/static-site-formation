/**
 * Components - navigation
 */

/* Imports */

import getSlug from '../../utils/get-slug'
import getPermalink from '../../utils/get-permalink'
import getLink from '../../utils/get-link'

/**
 * Class - recursively generate navigation output
 */

interface ItemBreadcrumb extends Formation.NavigationItem {
  slug: string
  contentType: string
}

interface Args {
  navs: Formation.Navigation[]
  items: Formation.NavigationItem[]
}

interface RecurseArgs {
  listClass?: string
  listAttr?: string
  itemClass?: string
  itemAttr?: string
  linkClass?: string
  internalLinkClass?: string
  linkAttr?: string
  filterBeforeItem?: Function
  filterAfterItem?: Function
  filterBeforeLink?: Function
  filterAfterLink?: Function
  filterBeforeLinkText?: Function
  filterAfterLinkText?: Function
}

interface BreadcrumbRecurseArgs extends RecurseArgs {
  currentClass?: string
  a11yClass?: string
}

class Navigation {
  /**
   * Set properties and initialize
   *
   * @param {object} args
   * @param {array<object>} args.navs
   * @param {array<object>} args.items
   * @return {void|boolean} - False if init errors
   */

  public navs: Formation.Navigation[]
  public items: Formation.NavigationItem[]
  public init: boolean

  private _itemsById: object
  private _navsByLocation: object

  constructor (args: Args) {
    const {
      navs = [],
      items = []
    } = args

    this.navs = navs
    this.items = items

    /**
     * Store items by od
     *
     * @private
     * @type {object}
     */

    this._itemsById = {}

    /**
     * Store navs by location
     *
     * @private
     * @type {object}
     */

    this._navsByLocation = {}

    /* Initialize */

    this.init = this._initialize()
  }

  /**
   * Initialize - check required props and set internal props
   *
   * @private
   * @return {boolean}
   */

  _initialize (): boolean {
    /* Check that required items exist */

    if (this.navs.length === 0 || this.items.length === 0) {
      return false
    }

    /* Items by id */

    this.items.forEach(item => {
      const info = this._getItemInfo(item)

      if (info?.id !== undefined) {
        this._itemsById[info.id] = info
      }
    })

    /* Navs by location */

    this.navs.forEach(nav => {
      const fields = nav

      const navFields = Object.assign({
        title: '',
        location: '',
        items: []
      }, fields)

      const { title, location, items } = navFields

      this._navsByLocation[location.toLowerCase().replace(/ /g, '')] = {
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

  _getItemInfo (item: Formation.NavigationItem): Formation.NavigationItem {
    const fields = item

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
      id = internalLink.id
    }

    const props: Formation.NavigationItem = {
      id,
      title,
      link,
      external
    }

    if (children !== undefined) {
      const c = []

      this._recurseItemChildren(children, c)

      props.children = c
    }

    return props
  }

  /**
   * Loop through items to check and set children
   *
   * @private
   * @param {array<object>} children
   * @param {array<object>} store
   * @return {void}
   */

  _recurseItemChildren (children: Formation.NavigationItem[] = [], store: object[] = []): void {
    children.forEach(child => {
      const info = this._getItemInfo(child)

      store.push(info)
    })
  }

  /**
   * Return navigation items by id
   *
   * @private
   * @param {array<object>} items
   * @param {string} current
   * @return {array<object>}
   */

  _getItems (items: Formation.NavigationItem[] = [], current: string = ''): Formation.NavigationItem[] {
    if (items.length === 0) {
      return []
    }

    return items.map(item => {
      const fields = item

      const {
        title = '',
        internalLink,
        externalLink = ''
      } = fields

      let id = title

      if (externalLink !== '' && item?.externalLink !== undefined) {
        id = item.externalLink
      }

      if ((internalLink !== undefined) && item?.internalLink?.id !== undefined) {
        id = item.internalLink.id
      }

      const obj = this._itemsById[id]

      obj.current = externalLink !== '' ? false : obj.link === current
      obj.descendentCurrent = current.includes(obj.link)

      return this._itemsById[id]
    })
  }

  /**
   * Loop through items to create html
   *
   * @private
   * @param {array<object>} items
   * @param {object} output
   * @param {number} depth
   * @param {object} args
   * @return {void}
   */

  _recurseOutput = (items: Formation.NavigationItem[] = [], output: { html: string }, depth: number = -1, args: RecurseArgs): void => {
    depth += 1

    const listClasses = args.listClass !== undefined ? ` class="${args.listClass}"` : ''
    const listAttrs = args.listAttr !== undefined ? ` ${args.listAttr}` : ''

    output.html += `<ul data-depth="${depth}"${listClasses}${listAttrs}>`

    items.forEach(item => {
      const {
        title = '',
        link = '',
        external = false,
        children = [],
        current = false,
        descendentCurrent = false
      } = item

      /* Item start */

      if (typeof args.filterBeforeItem === 'function') {
        args.filterBeforeItem(args, item, output)
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
        args.filterBeforeLink(args, item, output)
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
        args.filterBeforeLinkText(args, item, output)
      }

      output.html += title

      if (typeof args.filterAfterLinkText === 'function') {
        args.filterAfterLinkText(args, item, output)
      }

      /* Link end */

      output.html += `</${linkTag}>`

      if (typeof args.filterAfterLink === 'function') {
        args.filterAfterLink(args, item, output)
      }

      /* Nested content */

      if (children.length > 0) {
        this._recurseOutput(children, output, depth, args)
      }

      /* Item end */

      output.html += '</li>'

      if (typeof args.filterAfterItem === 'function') {
        args.filterAfterItem(args, item, output)
      }
    })

    output.html += '</ul>'
  }

  /**
   * Return navigation html output
   *
   * @param {string} location
   * @param {string} current
   * @param {object} args
   * @return {string} HTML - ul
   */

  getOutput (location: string = '', current: string = '', args: RecurseArgs): string {
    if (this._navsByLocation?.[location] === null) {
      return ''
    }

    const items = this._navsByLocation[location].items
    const normalizedItems = this._getItems(items, current)

    args = Object.assign({
      listClass: '',
      listAttr: '',
      itemClass: '',
      itemAttr: '',
      linkClass: '',
      internalLinkClass: '',
      linkAttr: '',
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

    this._recurseOutput(normalizedItems, output, -1, args)

    return output.html
  }

  /**
   * Return breadcrumbs html output
   *
   * @param {array<object>} items
   * @param {string} current
   * @param {object} args
   * @return {string} HTML - ol
   */

  getBreadcrumbs (items: ItemBreadcrumb[] = [], current: string = '', args: BreadcrumbRecurseArgs): string {
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

      /* Item */

      output.html += `<li${itemClasses}${itemAttrs} data-last-level="${isLastLevel.toString()}">`

      /* Link */

      if (typeof args.filterBeforeLink === 'function') {
        args.filterBeforeLink(output, isLastLevel)
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
        contentType: item.contentType
      })

      const permalink = typeof slug === 'string' ? getPermalink(slug) : ''

      output.html += `<a${linkClasses} href="${permalink}"${linkAttrs}>${item.title}</a>`

      if (typeof args.filterAfterLink === 'function') {
        args.filterAfterLink(output, isLastLevel)
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
