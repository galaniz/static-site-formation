/**
 * Config
 */

/* Imports */

import type { Config, ConfigArgs } from './configTypes'

/**
 * Default options
 *
 * @type {import('./configTypes').Config}
 */
let config: Config = {
  namespace: 'ssf',
  source: 'static',
  title: 'Static Site',
  meta: {
    description: '',
    image: ''
  },
  slug: {
    parents: {},
    archives: {},
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
  shortcodes: {},
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
    dir: '',
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
      slugArchives: {
        data: '',
        name: 'slug-archives.json'
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
      config: 'src/config/config.js',
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
  }
}

/**
 * Function - update default config with user options
 *
 * @param {import('./configTypes').ConfigArgs} args
 * @return {import('./configTypes').Config}
 */
const setConfig = (args: ConfigArgs): Config => {
  config = Object.assign(config, args)

  return config
}

/* Exports */

export { config, setConfig }
