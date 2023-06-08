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
  
  interface Config {
    namespace: string
    source: string
    title: string
    meta: {
      description: string
      image: string
      color: string
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
    image: {
      url: string
      sizes: number[]
    }
    script: {
      [key: string]: any
    }
    navigation: Navigation[]
    navigationItem: NavigationItem[]
    archive: Archive
    env: Env
    files: Files
    [key: string]: any
  }
}
