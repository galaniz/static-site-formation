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
 * @prop {object} contentTypes
 * @prop {string[]} contentTypes.partial
 * @prop {string[]} contentTypes.whole
 * @prop {object} contentTypes.archive
 * @prop {object} contentTypes.taxonomy
 * @prop {object} renderTypes
 * @prop {object} renderFunctions
 * @prop {object} ajaxFunctions
 * @prop {object} actions
 * @prop {object} filters
 * @prop {object} image
 * @prop {string} image.url
 * @prop {number} image.quality
 * @prop {number[]} image.sizes
 * @prop {object[]} navigation
 * @prop {object[]} navigationItem
 * @prop {object} scriptMeta
 * @prop {object} formMeta
 * @prop {object} archive
 * @prop {object} archive.ids
 * @prop {object} archive.posts
 * @prop {object} archive.terms
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
 * @prop {object} store.files.archivePosts
 * @prop {string} store.files.archivePosts.data
 * @prop {string} store.files.archivePosts.name
 * @prop {object} store.files.archiveTerms
 * @prop {string} store.files.archiveTerms.data
 * @prop {string} store.files.archiveTerms.name
 * @prop {object} store.files.formMeta
 * @prop {string} store.files.formMeta.data
 * @prop {string} store.files.formMeta.name
 * @prop {object} serverless
 * @prop {string} serverless.dir
 * @prop {object} serverless.files
 * @prop {string} serverless.files.ajax
 * @prop {string} serverless.files.preview
 * @prop {string} serverless.files.reload
 * @prop {object} serverless.routes
 * @prop {object[]} serverless.routes.reload
 * @prop {object} redirects
 * @prop {string} redirects.file
 * @prop {string[]} redirects.data
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
 * @prop {object} styles
 * @prop {object} styles.item
 * @prop {object} styles.build
 * @prop {object} scripts
 * @prop {object} scripts.item
 * @prop {object} scripts.build
 * @prop {object} apiKeys
 * @prop {string} apiKeys.smtp2go
 * @prop {object} console
 * @prop {string} console.green
 * @prop {string} console.red
 */

let config: FRM.Config = {
  namespace: 'ssf',
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
        title: ''
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
    ],
    archive: {},
    taxonomy: {}
  },
  renderTypes: {},
  renderFunctions: {},
  ajaxFunctions: {},
  actions: {},
  filters: {},
  image: {
    url: '/assets/img/',
    quality: 75,
    sizes: [
      200, 400, 600, 800, 1000, 1200, 1600, 2000
    ]
  },
  navigation: [],
  navigationItem: [],
  scriptMeta: {},
  formMeta: {},
  archive: {
    ids: {},
    posts: {},
    terms: {}
  },
  env: {
    dev: true,
    prod: false,
    build: false,
    cache: false,
    urls: {
      dev: '/',
      prod: ''
    }
  },
  store: {
    dir: 'src/json',
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
      archivePosts: {
        data: '',
        name: 'archive-posts.json'
      },
      archiveTerms: {
        data: '',
        name: 'archive-terms.json'
      },
      formMeta: {
        data: '',
        name: 'form-meta.json'
      }
    }
  },
  serverless: {
    dir: 'functions',
    import: 'lib',
    files: {
      ajax: 'ajax/index.js',
      preview: '',
      reload: ''
    },
    routes: {
      reload: []
    }
  },
  redirects: {
    file: 'site/_redirects',
    data: []
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
    dir: 'json',
    image: {
      inputDir: 'src/assets/img',
      outputDir: 'site/assets/img',
      dataFile: 'src/json/image-data.json'
    }
  },
  styles: {
    item: {},
    build: {}
  },
  scripts: {
    item: {},
    build: {}
  },
  apiKeys: {
    smtp2go: ''
  },
  console: {
    green: '\x1b[32m%s\x1b[0m',
    red: '\x1b[31m%s\x1b[0m'
  },
  vars: {}
}

/**
 * Function - update default config with user options
 *
 * @param {object} args
 * @return {object}
 */

const setConfig = (args: object): FRM.Config => {
  config = Object.assign(config, args)

  return config
}

/* Exports */

export { config, setConfig }
