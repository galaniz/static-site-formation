/**
 * Utils - Get Share Links
 */

/* Imports */

import type { ShareLinks, ShareLinksReturn } from './getShareLinksTypes'
import { isStringStrict } from '../isString/isString'
import { isArrayStrict } from '../isArray/isArray'

/**
 * Start of share links by platform
 *
 * @type {import('./getShareLinksTypes').ShareLinks}
 */
const _shareLinks: ShareLinks = {
  Facebook: 'https://www.facebook.com/sharer.php?u=',
  X: 'https://twitter.com/intent/tweet?url=',
  LinkedIn: 'https://www.linkedin.com/shareArticle?url=',
  Pinterest: 'https://pinterest.com/pin/create/button/?url=',
  Reddit: 'https://reddit.com/submit?url=',
  Email: ''
}

/**
 * Function - get social share links
 *
 * @param {string} url
 * @param {string[]} platforms
 * @return {import('./getShareLinksTypes').ShareLinksReturn[]}
 */
const getShareLinks = (url: string, platforms: Array<keyof ShareLinks>, title?: string): ShareLinksReturn[] => {
  if (!isStringStrict(url) || !isArrayStrict(platforms)) {
    return []
  }

  return platforms.map((platform) => {
    const platformLink = _shareLinks[platform]

    let link = platformLink !== undefined ? `${platformLink}${url}` : ''

    if (platform === 'Email') {
      link = `mailto:?subject=${encodeURIComponent(isStringStrict(title) ? title : 'Check out this article')}&body=${url}`
    }

    return {
      type: platform,
      link
    }
  })
}

/* Exports */

export { getShareLinks }
