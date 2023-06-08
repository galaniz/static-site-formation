/**
 * Utils - get slug
 */

/* Imports */

import { config } from '../../config'

/**
 * Function - recurse to get ascendents
 *
 * @private
 * @param {string} id
 * @param {array} p
 * @return {void}
 */

const _getParentSlug = (id: string = '', p: object[] = []): void => {
  if (config.slug.parents?.[id] !== undefined && id !== '') {
    p.unshift(config.slug.parents[id])

    _getParentSlug(config.slug.parents[id].id, p)
  }
}

/**
 * Function - get slug with base from slug base and parents
 *
 * @param {object} args
 * @param {string} args.id
 * @param {string} args.slug
 * @param {number} args.page
 * @param {string} args.contentType
 * @param {boolean} args.returnParents
 * @return {string|object}
 */

interface SlugArgs {
  id?: string
  slug: string
  page?: number
  contentType: string
  returnParents?: boolean
}

interface SlugParent extends Formation.SlugBase {
  contentType?: string
  id?: string
}

const getSlug = (args: SlugArgs): string | { slug: string, parents: object[] } => {
  const {
    id = '',
    slug = '',
    page = 0,
    contentType = 'page',
    returnParents = false
  } = args

  /* Index */

  if (slug === 'index') {
    return ''
  }

  /* Slug base */

  const slugBase: Formation.SlugBase = config.slug.bases[contentType]

  /* Parents */

  let p: string | Formation.SlugBase[] = []
  let pp: SlugParent[] = []

  _getParentSlug(contentType === 'page' ? id : slugBase.archiveId, p)

  if (p.length > 0) {
    pp = p

    p = `${p.map((item: { slug: string }): string => item.slug).join('/')}/`
  } else {
    p = ''
  }

  /* Slug */

  const s = `${p}${slugBase.slug}${slugBase.slug !== '' ? '/' : ''}${slug}${page !== 0 ? `/?page=${page}` : ''}`

  /* Parents and slug return */

  if (returnParents) {
    if (slugBase?.slug !== undefined && slugBase?.archiveId !== undefined) {
      pp.push({
        ...slugBase,
        contentType: 'page',
        id: slugBase.archiveId
      })
    }

    return {
      slug: s,
      parents: pp
    }
  }

  /* Slug return */

  return s
}

/* Exports */

export default getSlug
