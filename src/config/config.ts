/**
 * Config
 */

/* Imports */

import type { Generic, SlugBase } from '../global/types/types'
import type { Navigations, NavigationItem } from '../components/Navigation/Navigation'

/**
 * @typedef {object} ConfigMeta
 * @prop {string} description
 * @prop {string} image
 */
interface ConfigMeta {
  description: string
  image: string
}

/**
 * @typedef {object} ConfigSlugParent
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} title
 * @prop {string} contentType
 */
interface ConfigSlugParent {
  id: string
  slug: string
  title: string
  contentType: string
}

/**
 * @typedef {object} ConfigSlug
 * @prop {Object.<string, ConfigSlugParent>} parents
 * @prop {object} bases
 * @prop {SlugBase} bases.page
 * @prop {SlugBase} bases.[key] - Dynamic string key
 */
interface ConfigSlug {
  parents: {
    [key: string]: ConfigSlugParent
  }
  bases: {
    page: SlugBase
    [key: string]: SlugBase
  }
}

/**
 * @typedef {object} ConfigContentTypesArchive
 * @prop {string} singular
 * @prop {string} plural
 * @prop {string} [layout]
 * @prop {string} [order]
 * @prop {number} [display]
 * @prop {string[]} [linkContentType]
 * @prop {Object.<string, unknown>} id
 */
interface ConfigContentTypesArchive {
  singular: string
  plural: string
  layout?: string
  order?: string
  display?: number
  linkContentType?: string[]
  id: {
    [key: string]: unknown
  }
}

/**
 * @typedef {object} ConfigContentTypesTaxonomy
 * @prop {string[]} contentTypes
 * @prop {string[]} props
 */
interface ConfigContentTypesTaxonomy {
  contentTypes: string[]
  props: string[]
}

/**
 * @typedef {object} ConfigContentTypes
 * @prop {string[]} partial
 * @prop {string[]} whole
 * @prop {Object.<string, ConfigContentTypesArchive>} archive
 * @prop {Object.<string, ConfigContentTypesTaxonomy>} taxonomy
 */
interface ConfigContentTypes {
  partial: string[]
  whole: string[]
  archive: {
    [key: string]: ConfigContentTypesArchive
  }
  taxonomy: {
    [key: string]: ConfigContentTypesTaxonomy
  }
}

/**
 * @typedef {object} ConfigImage
 * @prop {string} url
 * @prop {number[]} sizes
 * @prop {number} quality
 */
interface ConfigImage {
  url: string
  sizes: number[]
  quality: number
}

/**
 * @typedef {object} ConfigArchive
 * @prop {Object.<string, unknown>} ids
 * @prop {Object.<string, unknown>} posts
 * @prop {Object.<string, unknown>} terms
 */
interface ConfigArchive {
  ids: {
    [key: string]: unknown
  }
  posts: {
    [key: string]: unknown
  }
  terms: {
    [key: string]: unknown
  }
}

/**
 * @typedef {object} ConfigEnv
 * @prop {boolean} dev
 * @prop {boolean} prod
 * @prop {boolean} build
 * @prop {boolean} cache
 * @prop {object} urls
 * @prop {string} urls.dev
 * @prop {string} urls.prod
 */
interface ConfigEnv {
  dev: boolean
  prod: boolean
  build: boolean
  cache: boolean
  urls: {
    dev: string
    prod: string
  }
}

/**
 * @typedef {object} ConfigStoreFile
 * @prop {string} data
 * @prop {string} name
 */
interface ConfigStoreFile {
  data: string
  name: string
}

/**
 * @typedef {object} ConfigStore
 * @prop {string} dir
 * @prop {object} files
 * @prop {ConfigStoreFile} files.slugs
 * @prop {ConfigStoreFile} files.slugParents
 * @prop {ConfigStoreFile} files.navigations
 * @prop {ConfigStoreFile} files.[key] - Dynamic string key
 */
interface ConfigStore {
  dir: string
  files: {
    slugs: ConfigStoreFile
    slugParents: ConfigStoreFile
    navigations: ConfigStoreFile
    [key: string]: ConfigStoreFile
  }
}

/**
 * @typedef {object} ConfigServerlessRoute
 * @prop {string} path
 * @prop {string} [content]
 */
interface ConfigServerlessRoute {
  path: string
  content?: string
}

/**
 * @typedef {object} ConfigServerless
 * @prop {string} dir
 * @prop {string} import
 * @prop {object} files
 * @prop {string} files.ajax
 * @prop {string} files.preview
 * @prop {string} files.reload
 * @prop {object} routes
 * @prop {ConfigServerlessRoute[]} routes.reload
 * @prop {ConfigServerlessRoute[]} routes.[key] - Dynamic string key
 */
interface ConfigServerless {
  dir: string
  import: string
  files: {
    ajax: string
    preview: string
    reload: string
  }
  routes: {
    reload: ConfigServerlessRoute[]
    [key: string]: ConfigServerlessRoute[]
  }
}

/**
 * @typedef {object} ConfigRedirects
 * @prop {string} file
 * @prop {string[]} data
 */
interface ConfigRedirects {
  file: string
  data: string[]
}

/**
 * @typedef {object} ConfigCms
 * @prop {string} name
 * @prop {string} space
 * @prop {string} previewAccessToken
 * @prop {string} previewHost
 * @prop {string} deliveryAccessToken
 * @prop {string} deliveryHost
 */
interface ConfigCms {
  name: string
  space: string
  previewAccessToken: string
  previewHost: string
  deliveryAccessToken: string
  deliveryHost: string
}

/**
 * @typedef {object} ConfigStatic
 * @prop {string} dir
 * @prop {object} image
 * @prop {string} image.inputDir
 * @prop {string} image.outputDir
 * @prop {string} image.dataFile
 */
interface ConfigStatic {
  dir: string
  image: {
    inputDir: string
    outputDir: string
    dataFile: string
  }
}

/**
 * @typedef {object} ConfigScriptsStyles
 * @prop {Object.<string, number>} item
 * @prop {Object.<string, string>} build
 */
interface ConfigScriptsStyles {
  item: {
    [key: string]: number
  }
  build: {
    [key: string]: string
  }
}

/**
 * @typedef {object} ConfigApiKeys
 * @prop {string} smtp2go
 */
interface ConfigApiKeys {
  smtp2go: string
}

/**
 * @typedef {object} ConfigConsole
 * @prop {string} green
 * @prop {string} red
 */
interface ConfigConsole {
  green: string
  red: string
}

/**
 * @typedef {object} Config
 * @prop {string} namespace
 * @prop {string} source
 * @prop {string} title
 * @prop {ConfigMeta} meta
 * @prop {ConfigSlug} slug
 * @prop {ConfigContentTypes} contentTypes
 * @prop {Object.<string, string>} renderTypes
 * @prop {Object.<string, function>} renderFunctions
 * @prop {Object.<string, function>} ajaxFunctions
 * @prop {Object.<string, function>} actions
 * @prop {Object.<string, function>} filters
 * @prop {ConfigImage} image
 * @prop {Navigations[]} navigation
 * @prop {NavigationItem[]} navigationItem
 * @prop {Generic} scriptMeta
 * @prop {Generic} formMeta
 * @prop {ConfigArchive} archive
 * @prop {ConfigEnv} env
 * @prop {ConfigStore} store
 * @prop {ConfigServerless} serverless
 * @prop {ConfigRedirects} redirects
 * @prop {ConfigCms} cms
 * @prop {ConfigStatic} static
 * @prop {ConfigScriptsStyles} styles
 * @prop {ConfigScriptsStyles} scripts
 * @prop {ConfigApiKeys} apiKeys
 * @prop {ConfigConsole} console
 */
export interface Config {
  namespace: string
  source: string
  title: string
  meta: ConfigMeta
  slug: ConfigSlug
  contentTypes: ConfigContentTypes
  renderTypes: {
    [key: string]: string
  }
  renderFunctions: {
    [key: string]: Function
  }
  ajaxFunctions: {
    [key: string]: Function
  }
  actions: {
    [key: string]: Function
  }
  filters: {
    [key: string]: Function
  }
  image: ConfigImage
  navigation: Navigations[]
  navigationItem: NavigationItem[]
  scriptMeta: Generic
  formMeta: Generic
  archive: ConfigArchive
  env: ConfigEnv
  store: ConfigStore
  serverless: ConfigServerless
  redirects: ConfigRedirects
  cms: ConfigCms
  static: ConfigStatic
  styles: ConfigScriptsStyles
  scripts: ConfigScriptsStyles
  apiKeys: ConfigApiKeys
  console: ConfigConsole
  vars: unknown
}

/**
 * Default options
 *
 * @type {Config}
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
 * @param {Config} args
 * @return {Config}
 */
const setConfig = (args: object): Config => {
  config = Object.assign(config, args)

  return config
}

/* Exports */

export { config, setConfig }
