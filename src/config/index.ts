/**
 * Config
 */

/**
 * Default options
 *
 * @type {object}
 * @prop {string} namespace
 * @prop {string} title
 * @prop {object} meta
 * @prop {string} meta.description
 * @prop {string} meta.image
 * @prop {string} meta.color
 * @prop {string} slug
 * @prop {object} slug.parents
 * @prop {object} slug.bases
 * @prop {object} slug.bases.page
 * @prop {string} slug.bases.page.slug
 * @prop {string} slug.bases.page.title
 * @prop {string} slug.bases.page.singular
 * @prop {string} slug.bases.page.archiveId
 * @prop {array<object>} navigation
 * @prop {array<object>} navigationItem
 * @prop {object} script
 * @prop {object} archive
 * @prop {object} archive.ids
 * @prop {object} env
 * @prop {boolean} env.dev
 * @prop {boolean} env.prod
 * @prop {boolean} env.build
 * @prop {object} env.urls
 * @prop {string} env.urls.dev
 * @prop {string} env.urls.prod
 * @prop {object} files
 * @prop {object} files.slugs
 * @prop {string} files.slugs.data
 * @prop {string} files.slugs.name
 * @prop {object} files.slugParents
 * @prop {string} files.slugParents.data
 * @prop {string} files.slugParents.name
 * @prop {object} files.navs
 * @prop {string} files.navs.data
 * @prop {string} files.navs.name
 */

let config: Formation.Config = {
  namespace: 'ss',
  title: 'Static Site',
  meta: {
    description: '',
    image: '',
    color: ''
  },
  slug: {
    parents: {},
    bases: {
      page: {
        slug: '',
        title: '',
        singular: '',
        archiveId: ''
      }
    }
  },
  contentTypesGet: [
    'navigation',
    'navigationItem',
    'page'
  ],
  navigation: [],
  navigationItem: [],
  script: {},
  archive: {
    ids: {}
  },
  env: {
    dev: true,
    prod: false,
    build: false,
    urls: {
      dev: '/',
      prod: ''
    }
  },
  files: {
    slugs: {
      data: '',
      name: 'slugs.json'
    },
    slugParents: {
      data: '',
      name: 'slug-parents.json'
    },
    navs: {
      data: '',
      name: 'navs.json'
    }
  }
}

/**
 * Function - update default config with user options
 *
 * @param {object} args
 * @return {void}
 */

const setConfig = (args: Formation.Config): void => {
  config = Object.assign(config, args)
}

/* Exports */

export { config, setConfig }
