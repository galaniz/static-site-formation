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

  interface Cms {
    name: string
    space: string
    previewAcessToken: string
    previewHost: string
    deliveryAcessToken: string
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
      [key: string]: any[]
    }
  }

  interface PreviewData {
    id: string
    contentType: string
  }

  interface Return {
    start: string
    end: string
  }

  interface ContainerProps {
    args: {
      tag?: string
      layout?: string
      maxWidth?: string
      paddingTop?: string
      paddingTopLarge?: string
      paddingBottom?: string
      paddingBottomLarge?: string
      gap?: string
      gapLarge?: string
      justify?: string
      align?: string
      classes?: string
      attr?: string
      richTextStyles?: string
    }
    parents?: object[]
  }

  interface ColumnProps {
    args: {
      tag?: string
      width?: string
      widthSmall?: string
      widthMedium?: string
      widthLarge?: string
      widthCustom?: {
        default: string
        small: string
        medium: string
        large: string
      }
      justify?: string
      align?: string
      grow?: boolean
      classes?: string
      style?: string
      attr?: string
    }
    parents?: object[]
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
      quality: number
    }
    script: {
      [key: string]: any
    }
    formMeta: {
      [key: string]: any
    }
    navigation: Navigation[]
    navigationItem: NavigationItem[]
    normalParams: {
      width: {
        full: string
      }
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
    classNames: {
      maxWidth: string
      justify: string
      align: string
      grow: string
      list: string
      richText: string
      column: string
      row: string
      gap: {
        column: string
        row: string
      }
      padding: {
        bottom: string
        top: string
      }
      width: {
        default: string
        custom: string
      }
      a11y: {
        visuallyHidden: string
        hide: string
      }
      form: {
        fieldset: string
        field: string
        input: string
        label: string
      }
    }
    // [key: string]: any
  }
}
