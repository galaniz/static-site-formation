/**
 * Components - pagination
 */

/**
 * Function - output pagination navigation
 *
 * @param {object} props
 * @param {number} props.total
 * @param {number} props.display
 * @param {number} props.current
 * @param {string} props.filters
 * @param {string} props.basePermaLink
 * @param {string} props.ellipsis
 * @param {string} props.prev
 * @param {string} props.next
 * @param {object} props.args
 * @param {string} props.args.listClass
 * @param {string} props.args.listAttr
 * @param {string} props.args.itemClass
 * @param {string} props.args.itemAttr
 * @param {boolean} props.args.itemMaxWidth - Set list item max width
 * @param {string} props.args.linkClass
 * @param {string} props.args.linkAttr
 * @param {string} props.args.currentClass
 * @param {string} props.args.a11yClass
 * @param {string} props.args.prevSpanClass
 * @param {string} props.args.prevLinkClass
 * @param {string} props.args.nextSpanClass
 * @param {string} props.args.nextLinkClass
 * @return {string} HTML - ol
 */

interface PaginationProps {
  total?: number
  display?: number
  current?: number
  filters?: string
  basePermaLink?: string
  ellipsis?: string
  prev?: string
  next?: string
  args?: PaginationArgs
}

interface PaginationArgs {
  listClass?: string
  listAttr?: string
  itemClass?: string
  itemAttr?: string
  itemMaxWidth?: boolean
  linkClass?: string
  linkAttr?: string
  currentClass?: string
  a11yClass?: string
  prevSpanClass?: string
  prevLinkClass?: string
  nextSpanClass?: string
  nextLinkClass?: string
}

interface PaginationData {
  current?: number
  title?: string
  next?: number
  prev?: number
  nextFilters?: string
  prevFilters?: string
  currentFilters?: string
}

interface PaginationReturn {
  output: string
  data: PaginationData
}

const pagination = (props: PaginationProps = {}): PaginationReturn => {
  const {
    total = 1,
    display = 5,
    current = 1,
    filters = '',
    basePermaLink = '',
    ellipsis = '',
    prev = '',
    next = '',
    args = {}
  } = props

  const {
    listClass = '',
    listAttr = '',
    itemClass = '',
    itemAttr = '',
    itemMaxWidth = false,
    linkClass = '',
    linkAttr = '',
    currentClass = '',
    a11yClass = 'a11y-visually-hidden',
    prevSpanClass = '',
    prevLinkClass = '',
    nextSpanClass = '',
    nextLinkClass = ''
  } = args

  /* Total must be greater than 1 and base link required */

  if (total <= 1 || basePermaLink === '') {
    return {
      output: '',
      data: {}
    }
  }

  /* Store items output */

  let output = ''

  /* Url param filters */

  let prevFilters = filters
  let nextFilters = filters
  let currentFilters = filters

  if (filters !== '') {
    if (current > 2) {
      prevFilters = `&${prevFilters}`
    } else {
      prevFilters = `?${prevFilters}`
    }

    nextFilters = `&${nextFilters}`

    if (current === 1) {
      currentFilters = `?${currentFilters}`
    } else {
      currentFilters = `&${currentFilters}`
    }
  }

  /* Meta data for head tags and urls */

  const data: PaginationData = {
    current,
    nextFilters,
    currentFilters
  }

  if (current === 1) {
    data.next = current + 1
  } else {
    data.title = `Page ${current} of ${total}`
    data.next = current + 1 <= total ? current + 1 : 0
    data.prev = current - 1
    data.prevFilters = prevFilters
  }

  /* Determine number of items to display */

  const max = display - 1
  const half = max / 2
  const center = total > max
  const limit = center ? max : total - 1

  let start = 1

  if (center) {
    start = current < max ? 1 : current - half
  }

  if (start > total - limit) {
    start = total - limit
  }

  let totalPagesItems = start + limit

  if (totalPagesItems > total) {
    totalPagesItems = total
  }

  /* List attributes */

  const listAttrs: string[] = []

  if (listClass !== '') {
    listAttrs.push(`class="${listClass}"`)
  }

  if (listAttr !== '') {
    listAttrs.push(listAttr)
  }

  /* Max width */

  let maxWidth = ''

  if (itemMaxWidth) {
    let totalListItems = totalPagesItems + 2 // 2 for prev and next buttons

    if (center && ellipsis !== '' && current >= limit) {
      totalListItems += 1
    }

    if (center && ellipsis !== '' && current < total - half) {
      totalListItems += 1
    }

    maxWidth = ` style="max-width:${100 / totalListItems}%"`
  }

  /* Item attributes */

  const itemAttrs = `${itemClass !== '' ? ` class="${itemClass}"` : ''}${itemAttr !== '' ? ` ${itemAttr}` : ''}${maxWidth}`

  /* Previous item */

  let prevItem = `<span${prevSpanClass !== '' ? ` class="${prevSpanClass}"` : ''}>${prev}</span>`

  if (current > 1) {
    prevItem = `
      <a${prevLinkClass !== '' ? ` class="${prevLinkClass}"` : ''}
        href="${basePermaLink}${current > 2 ? `?page=${current - 1}` : ''}${prevFilters}"
        aria-label="Previous page"
      >
        ${prev}
      </a>
    `
  }

  output += `<li${itemAttrs}>${prevItem}</li>`

  /* Ellipsis */

  let ellipsisOutput = ''

  if (ellipsis !== '') {
    ellipsisOutput = `<li${itemAttrs} aria-hidden="true">${ellipsis}</li>`
  }

  if (center && current >= limit) {
    output += ellipsisOutput
  }

  /* Items loop */

  for (let i = start; i <= totalPagesItems; i += 1) {
    let content = ''

    if (i === current) {
      content = `
        <span${currentClass !== '' ? ` class="${currentClass}"` : ''}>
          <span class="${a11yClass}">Current page </span>
          ${i}
        </span>
      `
    } else {
      const link = i === 1 ? basePermaLink : `${basePermaLink}?page=${i}`

      content = `
        <a${linkClass !== '' ? ` class="${linkClass}"` : ''}${linkAttr !== '' ? ` ${linkAttr}` : ''}href="${link}${currentFilters}">
          <span class="${a11yClass}">Page </span>
          ${i}
        </a>
      `
    }

    output += `<li${itemAttrs}>${content}</li>`
  }

  /* Ellipsis */

  if (center && current < total - half) {
    output += ellipsisOutput
  }

  /* Next item */

  let nextItem = `<span${nextSpanClass !== '' ? ` class="${nextSpanClass}"` : ''}>${next}</span>`

  if (current < total) {
    nextItem = `
      <a${nextLinkClass !== '' ? ` class="${nextLinkClass}"` : ''}
        href="${basePermaLink}?page=${current + 1}${nextFilters}"
        aria-label="Next page"
      >
        ${next}
      </a>
    `
  }

  output += `<li${itemAttrs}>${nextItem}</li>`

  /* Output */

  return {
    output: `
      <ol${listAttrs.length > 0 ? ` ${listAttrs.join(' ')}` : ''}}>
        ${output}
      </ol>
    `,
    data
  }
}

/* Exports */

export default pagination