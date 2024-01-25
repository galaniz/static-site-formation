/**
 * Utils - Get Slug
 */

/* Imports */

import type { SlugArgs, SlugReturn } from './getSlugTypes'
import type { SlugBase, SlugParent } from '../../global/globalTypes'
import { config } from '../../config/config'
import { getArchiveId } from '../getArchiveId/getArchiveId'

/**
 * Function - recurse to get ascendents
 *
 * @private
 * @param {string} id
 * @param {SlugParent[]} p
 * @return {void}
 */
const _getParentSlug = (id: string = '', p: SlugParent[] = []): void => {
  if (config.slug.parents[id] !== undefined && id !== '') {
    p.unshift(config.slug.parents[id])

    _getParentSlug(config.slug.parents[id].id, p)
  }
}

/**
 * Function - get slug with base from slug base and parents
 *
 * @param {SlugArgs} args
 * @return {string|SlugReturn}
 */
const getSlug = (args: SlugArgs): string | SlugReturn => {
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

  const slugBase: SlugBase = config.slug.bases[contentType]

  /* Archive id */

  const archiveId = getArchiveId(contentType, linkContentType)

  /* Parents */

  let p: string | SlugBase[] = []
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
    if (slugBase.slug !== undefined && archiveId !== '') {
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

export { getSlug }
