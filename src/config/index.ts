/**
 * Config
 */

/**
 * Default options
 *
 * @type {object}
 * @prop {string} namespace
 * @prop {string} source
 * @prop {string} title
 * @prop {object} meta
 * @prop {string} meta.description
 * @prop {string} meta.image
 * @prop {string} slug
 * @prop {object} slug.parents
 * @prop {object} slug.bases
 * @prop {object} slug.bases.page
 * @prop {string} slug.bases.page.slug
 * @prop {string} slug.bases.page.title
 * @prop {string} slug.bases.page.singular
 * @prop {string} slug.bases.page.archiveId
 * @prop {object} contentTypes
 * @prop {array<string>} contentTypes.partial
 * @prop {array<string>} contentTypes.whole
 * @prop {object} renderTypes
 * @prop {object} renderFunctions
 * @prop {object} ajaxFunctions
 * @prop {object} image
 * @prop {string} image.url
 * @prop {number} image.quality
 * @prop {array<number>} image.sizes
 * @prop {array<object>} navigation
 * @prop {array<object>} navigationItem
 * @prop {array<object>} redirect
 * @prop {array<object>} serverlessRoutes
 * @prop {object} script
 * @prop {object} formMeta
 * @prop {object} archive
 * @prop {object} archive.ids
 * @prop {object} archive.counts
 * @prop {object} archive.posts
 * @prop {object} env
 * @prop {boolean} env.dev
 * @prop {boolean} env.prod
 * @prop {boolean} env.build
 * @prop {object} env.urls
 * @prop {string} env.urls.dev
 * @prop {string} env.urls.prod
 * @prop {object} store
 * @prop {string} store.dir
 * @prop {object} store.files
 * @prop {object} store.files.slugs
 * @prop {string} store.files.slugs.data
 * @prop {string} store.files.slugs.name
 * @prop {object} store.files.slugParents
 * @prop {string} store.files.slugParents.data
 * @prop {string} store.files.slugParents.name
 * @prop {object} store.files.navigations
 * @prop {string} store.files.navigations.data
 * @prop {string} store.files.navigations.name
 * @prop {object} store.files.archiveIds
 * @prop {string} store.files.archiveIds.data
 * @prop {string} store.files.archiveIds.name
 * @prop {object} store.files.archiveCounts
 * @prop {string} store.files.archiveCounts.data
 * @prop {string} store.files.archiveCounts.name
 * @prop {object} store.files.archivePosts
 * @prop {string} store.files.archivePosts.data
 * @prop {string} store.files.archivePosts.name
 * @prop {object} store.files.formMeta
 * @prop {string} store.files.formMeta.data
 * @prop {string} store.files.formMeta.name
 * @prop {object} cms
 * @prop {string} cms.name
 * @prop {string} cms.space
 * @prop {string} cms.previewAccessToken
 * @prop {string} cms.previewHost
 * @prop {string} cms.deliveryAccessToken
 * @prop {string} cms.deliveryHost
 * @prop {object} static
 * @prop {string} static.dir
 * @prop {object} static.image
 * @prop {string} static.image.inputDir
 * @prop {string} static.image.outputDir
 * @prop {string} static.image.dataFile
 * @prop {object} modules
 * @prop {object} modules.cache
 * @prop {string} modules.cache.path
 * @prop {boolean} modules.cache.local
 * @prop {object} modules.contentfulResolveResponse
 * @prop {string} modules.contentfulResolveResponse.path
 * @prop {boolean} modules.contentfulResolveResponse.local
 * @prop {object} apiKeys
 * @prop {string} apiKeys.smtp2go
 */

let config: Formation.Config = {
  namespace: 'ss',
  source: 'static',
  title: 'Static Site',
  meta: {
    description: '',
    image: ''
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
  contentTypes: {
    partial: [
      'navigation',
      'navigationItem',
      'redirect'
    ],
    whole: [
      'page'
    ]
  },
  renderTypes: {},
  renderFunctions: {},
  ajaxFunctions: {},
  image: {
    url: '/assets/img/',
    quality: 75,
    sizes: [
      200, 400, 600, 800, 1000, 1200, 1600, 2000
    ]
  },
  navigation: [],
  navigationItem: [],
  redirect: [],
  serverlessRoutes: [],
  script: {},
  formMeta: {},
  archive: {
    ids: {},
    counts: {},
    posts: {}
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
  store: {
    dir: './src/json/',
    files: {
      slugs: {
        data: '',
        name: 'slugs.json'
      },
      slugParents: {
        data: '',
        name: 'slug-parents.json'
      },
      navigations: {
        data: '',
        name: 'navigations.json'
      },
      archiveIds: {
        data: '',
        name: 'archive-ids.json'
      },
      archiveCounts: {
        data: '',
        name: 'archive-counts.json'
      },
      archivePosts: {
        data: '',
        name: 'archive-posts.json'
      },
      formMeta: {
        data: '',
        name: 'form-meta.json'
      }
    }
  },
  cms: {
    name: '',
    space: '',
    previewAccessToken: '',
    previewHost: '',
    deliveryAccessToken: '',
    deliveryHost: ''
  },
  static: {
    dir: './json/',
    image: {
      inputDir: './src/assets/img/',
      outputDir: './site/assets/img/',
      dataFile: './src/json/image-data.json'
    }
  },
  modules: {
    cache: {
      path: '',
      local: false
    },
    contentfulResolveResponse: {
      path: '',
      local: false
    }
  },
  apiKeys: {
    smtp2go: ''
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
