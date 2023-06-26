/**
 * Static Site Formation - interfaces
 */

declare namespace Formation {
  interface Env {
    dev: boolean
    prod: boolean
    build: boolean
    urls: {
      dev: string
      prod: string
    }
    [key: string]: any
  }

  interface InternalLink {
    id: string
    contentType: string
    slug: string
    title?: string
    [key: string]: any
  }

  interface SlugBase {
    slug: string
    title: string
    singular: string
    archiveId?: string
  }

  interface NavigationItem {
    id?: string
    title: string
    link?: string
    internalLink?: InternalLink
    externalLink?: string
    children?: NavigationItem[]
    current?: boolean
    external?: boolean
    descendentCurrent?: boolean
    [key: string]: any
  }

  interface Navigation {
    title?: string
    location: string
    items: NavigationItem[]
    [key: string]: any
  }

  interface Archive {
    ids: {
      [key: string]: string
    }
    counts: {
      [key: string]: number
    }
    posts: {
      [key: string]: any
    }
  }

  interface File {
    data: string
    name: string
  }

  interface Files {
    slugs: File
    slugParents: File
    navigations: File
    [key: string]: File
  }

  interface Module {
    path: string
    local: boolean
  }

  interface Cms {
    name: string
    space: string
    previewAccessToken: string
    previewHost: string
    deliveryAccessToken: string
    deliveryHost: string
  }

  interface AllData {
    navigation: Navigation[]
    navigationItem: NavigationItem[]
    content: {
      page: any[]
      [key: string]: any[]
    }
    [key: string]: any
  }

  interface ServerlessData {
    path: string
    query: {
      [key: string]: any
    }
  }

  interface ServerlessRoute {
    path: string
    contentType: string
    props: object | undefined
  }

  interface PreviewData {
    id: string
    contentType: string
  }

  interface Return {
    start: string
    end: string
  }

  interface AjaxActionArgs {
    id: string
    inputs: {
      [key: string]: {
        type: string
        label: string
        value: string | string[]
        legend?: string
      }
    }
  }

  interface AjaxActionReturn {
    error?: {
      message: string
    }
    success?: {
      message: string
    }
  }

  interface Config {
    namespace: string
    source: string
    title: string
    meta: {
      description: string
      image: string
    }
    slug: {
      parents: {
        [key: string]: {
          id: string
          slug: string
          title: string
          contentType: string
        }
      }
      bases: {
        page: SlugBase
        [key: string]: SlugBase
      }
    }
    contentTypes: {
      partial: string[]
      whole: string[]
    }
    renderTypes: {
      [key: string]: string
    }
    renderFunctions: {
      [key: string]: Function
    }
    ajaxFunctions: {
      [key: string]: Function
    }
    image: {
      url: string
      sizes: number[]
      quality: number
    }
    navigation: Navigation[]
    navigationItem: NavigationItem[]
    redirect: string[]
    serverlessRoutes: ServerlessRoute[]
    script: {
      [key: string]: any
    }
    formMeta: {
      [key: string]: any
    }
    archive: Archive
    env: Env
    store: {
      dir: string
      files: Files
    }
    cms: Cms
    static: {
      dir: string
      image: {
        inputDir: string
        outputDir: string
        dataFile: string
      }
    }
    modules: {
      cache?: Module
      contentfulResolveResponse?: Module
    }
    apiKeys: {
      smtp2go: string
    }
    // [key: string]: any
  }
}
