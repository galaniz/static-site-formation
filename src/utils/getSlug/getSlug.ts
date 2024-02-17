/**
 * Utils - Get Slug
 */

/* Imports */

import type { SlugArgs, SlugReturn } from './getSlugTypes'
import type { SlugBase, SlugParent } from '../../global/globalTypes'
import { config } from '../../config/config'
import { getArchiveId } from '../getArchiveId/getArchiveId'
import { isObjectStrict } from '../isObject/isObject'

/**
 * Function - recurse to get ascendents
 *
 * @private
 * @param {string} id
 * @param {import('../../global/globalTypes').SlugParent[]} p
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
 * @param {import('./getSlugTypes').SlugArgs} args
 * @return {string|import('./getSlugTypes').SlugReturn}
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

  /* Archive id */

  const archiveId = getArchiveId(contentType, linkContentType)

  /* Slug base */

  const slugBase: SlugBase = config.slug.bases[contentType]

  let slugBaseSlug = ''
  let slugBaseOutput = ''

  if (isObjectStrict(slugBase)) {
    slugBaseSlug = slugBase.slug

    if (slugBaseSlug === 'archive' && archiveId !== '') {
      slugBaseSlug = config.slug.archives[archiveId].slug
    }

    slugBaseOutput = `${slugBaseSlug}${slugBaseSlug !== '' ? '/' : ''}`
  }

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

  const s = `${p}${slugBaseOutput}${slug}${page !== 0 ? `/?page=${page}` : ''}`

  /* Parents and slug return */

  if (returnParents) {
    if (slugBaseSlug !== '' && archiveId !== '') {
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
