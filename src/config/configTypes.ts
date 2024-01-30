/**
 * Config - Types
 */

/* Imports */

import type { Generic, GenericFunctions, GenericStrings, GenericNumbers, SlugBase } from '../global/globalTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'
import type { RenderItem } from '../render/RenderTypes'
import type { Filters } from '../utils/filters/filtersTypes'

/**
 * @typedef {object} ConfigMeta
 * @prop {string} description
 * @prop {string} image
 */
export interface ConfigMeta {
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
export interface ConfigSlugParent {
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
 * @prop {SlugBase} bases.[key] - Dynamic key
 */
export interface ConfigSlug {
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
export interface ConfigContentTypesArchive {
  singular: string
  plural: string
  layout?: string
  order?: string
  display?: number
  linkContentType?: string[]
  id: Generic
}

/**
 * @typedef {object} ConfigContentTypesTaxonomy
 * @prop {string[]} contentTypes
 * @prop {string[]} props
 */
export interface ConfigContentTypesTaxonomy {
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
export interface ConfigContentTypes {
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
export interface ConfigImage {
  url: string
  sizes: number[]
  quality: number
}

/**
 * @typedef {object} ConfigArchive
 * @prop {Object.<string, *>} ids
 * @prop {Object.<string, *>} posts
 * @prop {Object.<string, *>} terms
 */
export interface ConfigArchive {
  ids: {
    [key: string]: GenericStrings
  }
  posts: {
    [key: string]: RenderItem[]
  }
  terms: {
    [key: string]: {
      [key: string]: {
        [key: string]: RenderItem[]
      }
    }
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
export interface ConfigEnv {
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
export interface ConfigStoreFile {
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
 * @prop {ConfigStoreFile} files.[key] - Dynamic key
 */
export interface ConfigStore {
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
export interface ConfigServerlessRoute {
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
 * @prop {ConfigServerlessRoute[]} routes.[key] - Dynamic key
 */
export interface ConfigServerless {
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
export interface ConfigRedirects {
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
export interface ConfigCms {
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
export interface ConfigStatic {
  dir: string
  image: {
    inputDir: string
    outputDir: string
    dataFile: string
  }
}

/**
 * @typedef {object} ConfigScriptsStyles
 * @prop {GenericNumbers} item
 * @prop {GenericStrings} build
 */
export interface ConfigScriptsStyles {
  item: GenericNumbers
  build: GenericStrings
}

/**
 * @typedef {object} ConfigApiKeys
 * @prop {string} smtp2go
 */
export interface ConfigApiKeys {
  smtp2go: string
}

/**
 * @typedef {object} ConfigConsole
 * @prop {string} green
 * @prop {string} red
 */
export interface ConfigConsole {
  green: string
  red: string
}

/**
 * @typedef {object} ConfigBase
 * @prop {string} namespace
 * @prop {string} source
 * @prop {string} title
 * @prop {ConfigMeta} meta
 * @prop {ConfigSlug} slug
 * @prop {ConfigContentTypes} contentTypes
 * @prop {GenericStrings} renderTypes
 * @prop {GenericFunctions} renderFunctions
 */
export interface ConfigBase {
  namespace: string
  source: string
  title: string
  meta: ConfigMeta
  slug: ConfigSlug
  contentTypes: ConfigContentTypes
  renderTypes: GenericStrings
  renderFunctions: GenericFunctions
}

/**
 * @typedef Config
 * @type {ConfigBase}
 * @prop {GenericFunctions} ajaxFunctions
 * @prop {GenericFunctions} actions
 * @prop {Filters} filters
 * @prop {ConfigImage} image
 * @prop {Navigation[]} navigation
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
export interface Config extends ConfigBase {
  ajaxFunctions: GenericFunctions
  actions: GenericFunctions
  filters: Partial<Filters>
  image: ConfigImage
  navigation: Navigation[]
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
}

/**
 * @typedef ConfigArgs
 * @type {ConfigBase}
 * @prop {GenericFunctions} [ajaxFunctions]
 * @prop {GenericFunctions} [actions]
 * @prop {Filters} [filters]
 * @prop {ConfigImage} [image]
 * @prop {Generic} [scriptMeta]
 * @prop {Generic} [formMeta]
 * @prop {ConfigArchive} [archive]
 * @prop {ConfigEnv} [env]
 * @prop {ConfigStore} [store]
 * @prop {ConfigServerless} [serverless]
 * @prop {ConfigRedirects} [redirects]
 * @prop {ConfigCms} [cms]
 * @prop {ConfigStatic} [static]
 * @prop {ConfigScriptsStyles} [styles]
 * @prop {ConfigScriptsStyles} [scripts]
 * @prop {ConfigApiKeys} [apiKeys]
 */
export type ConfigArgs = Partial<Config>
