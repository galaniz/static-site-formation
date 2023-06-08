/**
 * Utils - set data vars
 */

/* Imports */

import { config } from '../../config'
import { slugData, envData, navData, archiveData } from '../../vars/data'

/**
 * Function - set env, nav, slug and archive objects
 *
 * @param {object} env
 * @return {void}
 */

const setDataVars = (env: { dev: boolean, prod: boolean }): void => {
  try {
    /* eslint-disable @typescript-eslint/no-var-requires */

    const slugParentsJson = require('../../json/slug-parents.json')
    const archiveIdsJson = require('../../json/archive-ids.json')
    const archivePostsJson = require('../../json/archive-posts.json')
    const navDataJson = require('../../json/nav-data.json')

    /* eslint-enable @typescript-eslint/no-var-requires */

    /* Set env */

    config.env.dev = env.dev
    config.env.prod = env.prod

    /* Set slug parents */

    if (slugParentsJson != null) {
      Object.keys(slugParentsJson).forEach((s) => {
        slugData.parents[s] = slugParentsJson[s]
      })
    }

    /* Set archive ids */

    if (archiveIdsJson != null) {
      Object.keys(archiveIdsJson).forEach((a) => {
        if (slugData.bases?.[a] != null) {
          slugData.bases[a].archiveId = archiveIdsJson[a]
        }
      })
    }

    /* Set archive posts */

    if (archivePostsJson != null) {
      Object.keys(archivePostsJson).forEach((a) => {
        archiveData.posts[a] = archivePostsJson[a]
      })
    }

    /* Set nav data */

    if (navDataJson != null) {
      navData.navs = navDataJson.navs
      navData.items = navDataJson.items
    }
  } catch (error) {
    console.error('Error setting data vars: ', error)
  }
}

/* Exports */

export default setDataVars
