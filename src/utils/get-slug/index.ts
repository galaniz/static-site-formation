/**
 * Utils - get slug
 */

/* Imports */

import config from '../../config'
import getArchiveId from '../get-archive-id'

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
  linkContentType?: string
  returnParents?: boolean
}

interface SlugParent extends FRM.SlugBase {
  contentType?: string
  id?: string
}

const getSlug = (args: SlugArgs): string | { slug: string, parents: object[] } => {
  const {
    id = '',
    slug = '',
    page = 0,
    contentType = 'page',
    linkContentType = 'default',
    returnParents = false
  } = args

  /* Index */

  if (slug === 'index') {
    return ''
  }

  /* Slug base */

  const slugBase: FRM.SlugBase = config.slug.bases[contentType]

  /* Archive id */

  const archiveId = getArchiveId(contentType, linkContentType)

  /* Parents */

  let p: string | FRM.SlugBase[] = []
  let pp: SlugParent[] = []

  _getParentSlug(contentType === 'page' ? id : archiveId, p)

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
    if (slugBase?.slug !== undefined && archiveId !== '') {
      pp.unshift({
        ...slugBase,
        contentType: 'page',
        id: archiveId
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
