/**
 * Utils - Get Share Links Types
 */

/**
 * @typedef {object} ShareLinks
 * @prop {string} Facebook
 * @prop {string} X
 * @prop {string} LinkedIn
 * @prop {string} Pinterest
 * @prop {string} Reddit
 * @prop {string} Email
 */
export interface ShareLinks {
  Facebook: string
  X: string
  LinkedIn: string
  Pinterest: string
  Reddit: string
  Email: string
}

/**
 * @typedef {object} ShareLinksReturn
 * @prop {string} type
 * @prop {string} link
 */
export interface ShareLinksReturn {
  type: string
  link: string
}
