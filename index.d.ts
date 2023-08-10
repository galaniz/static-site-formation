/**
 * Static Site Formation - type definitions
 */

declare global {
  module FRM {
    /* General */

    interface AnyObject {
      [key: string]: any
    }

    /* Link data */

    interface InternalLinkBase {
      id: string
      contentType: string
      slug: string
      title?: string
      linkContentType?: string
    }

    interface InternalLink extends InternalLinkBase {
      [key: string]: any
    }

    interface SlugBase {
      slug: string
      title: string
    }

    /* Archive meta data */

    interface ArchiveMeta {
      singular: string
      plural: string
      layout?: string
      order?: string
      display?: number
      linkContentType?: string[]
      id: AnyObject
    }

    interface TaxonomyMeta {
      contentTypes: string[]
      props: string[]
    }

    /* Navigation data */

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

    interface NavigationBreadcrumbItem extends NavigationItem {
      slug: string
      contentType: string
    }

    interface NavigationArgs {
      listClass?: string
      listAttr?: string
      itemClass?: string
      itemAttr?: string
      linkClass?: string
      internalLinkClass?: string
      linkAttr?: string
      filterBeforeItem?: Function
      filterAfterItem?: Function
      filterBeforeLink?: Function
      filterAfterLink?: Function
      filterBeforeLinkText?: Function
      filterAfterLinkText?: Function
    }

    interface NavigationOutput {
      html: string
    }

    interface Navigation {
      title?: string
      location: string
      items: NavigationItem[]
      [key: string]: any
    }

    /* Info for write files utilities */

    interface StoreFile {
      data: string
      name: string
    }

    interface StoreFiles {
      slugs: StoreFile
      slugParents: StoreFile
      navigations: StoreFile
      [key: string]: StoreFile
    }

    interface ServerlessRoute {
      path: string
      content?: string
    }

    /* Contentful info */

    interface Cms {
      name: string
      space: string
      previewAccessToken: string
      previewHost: string
      deliveryAccessToken: string
      deliveryHost: string
    }

    /* Render data */

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

    interface PreviewData {
      id: string
      contentType: string
    }

    /* Render item data */

    interface RenderItem {
      id: string
      title: string
      slug: string
      content?: any
      meta?: object
      basePermalink?: string
      [key: string]: any
    }

    /* Common function return value */

    interface StartEndReturn {
      start: string
      end: string
    }

    interface RenderReturn {
      slug: string
      output: string
    }

    interface MetaReturn {
      title: string
      paginationTitle?: string
      description?: string
      url?: string
      image?: string | object
      canonical?: string
      prev?: string
      next?: string
      noIndex?: boolean
      isIndex?: boolean
    }

    /* Layout render function arguments */

    interface LayoutArgs {
      id: string
      meta: MetaReturn
      navigations?: AnyObject
      contentType: string
      content: string
      slug: string
      pageContains: string[]
      pageData: RenderItem
      serverlessData?: ServerlessData | undefined
    }

    /* Parent args in render functions */

    interface ParentArgs {
      renderType: string
      args: object
    }

    /* Container render function props */

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
        style?: string
        attr?: string
        richTextStyles?: boolean
        [key: string]: any
      }
      parents?: ParentArgs[]
    }

    /* Column render function props */

    interface ColumnProps {
      args: {
        tag?: string
        width?: string
        widthSmall?: string
        widthMedium?: string
        widthLarge?: string
        widthCustom?: {
          class?: string
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
        [key: string]: any
      }
      parents?: ParentArgs[]
    }

    /* Field render function props */

    interface FieldProps {
      args: {
        type?: string
        name?: string
        label?: string
        value?: string
        required?: boolean
        width?: string
        widthSmall?: string
        widthMedium?: string
        widthLarge?: string
        grow?: boolean
        autoCompleteToken?: string
        placeholder?: string
        options?: string[]
        rows?: number
        emptyErrorMessage?: string
        invalidErrorMessage?: string
        fieldset?: boolean
        fieldsetClasses?: string
        fieldClasses?: string
        labelClasses?: string
        classes?: string
        visuallyHiddenClass?: string
        [key: string]: any
      }
    }

    /* Form render function props */

    interface FormProps {
      args: {
        id?: string
        action?: string
        subject?: string
        toEmail?: string
        senderEmail?: string
        submitLabel?: string
        successTitle?: string
        successText?: string
        successResult?: string
        errorTitle?: string
        errorText?: string
        errorSummary?: string
        errorResult?: string
        formClasses?: string
        formAttr?: string
        fieldsClasses?: string
        fieldsAttr?: string
        submitFieldClasses?: string
        submitClasses?: string
        submitAttr?: string
        submitLoader?: string
        honeypotFieldClasses?: string
        honeypotLabelClasses?: string
        honeypotClasses?: string
        [key: string]: any
      }
    }

    /* Rich text render function props */

    interface RichTextProps {
      args: {
        type?: string
        tag?: string
        content?: string | object[]
        classes?: string
        textStyle?: string
        headingStyle?: string
        caption?: string
        align?: string
        link?: string
        internalLink?: InternalLink
        style?: string
        attr?: string
        [key: string]: any
      }
      parents?: ParentArgs[]
    }

    /* Normalize content rich text render function */

    interface RichTextContentItem {
      tag?: string | string[]
      link?: string
      internalLink?: InternalLink
      content?: string | RichTextContentItem[]
      nodeType?: string
      value?: string
      marks?: Array<{ type: string }>
      data?: {
        uri?: string
        target?: any
      }
    }

    /* Action arguments */

    interface RenderItemStartActionArgs {
      id: string
      contentType: string
      pageData: RenderItem
      pageContains: string[]
      serverlessData: ServerlessData | undefined
    }

    interface RenderItemEndActionArgs {
      id: string
      contentType: string
      slug: string
      output: string
      pageData: RenderItem
      pageContains: string[]
      serverlessData: ServerlessData | undefined
    }

    /* Filter arguments */

    interface RenderItemFilterArgs {
      id: string
      contentType: string
      slug: string
      output: string
      pageData: RenderItem
      pageContains: string[]
      serverlessData: ServerlessData | undefined
    }

    interface RichTextNormalizeContentFilterArgs {
      type: string | string[]
      args: RichTextContentItem
    }

    interface RichTextContentFilterArgs {
      args: RichTextContentItem
      props: RichTextProps
    }

    interface RichTextContentOutputFilterArgs {
      args: RichTextContentItem
      props: RichTextProps
    }

    interface CacheDataFilterArgs {
      key: string
      type: string
      data?: any
    }

    /* Serverless functions arguments */

    interface EnvCloudflare {
      ENVIRONMENT?: string
      SMPT2GO_API_KEY?: string
      [key: string]: any
    }

    interface AjaxActionData {
      id: string
      inputs: {
        [key: string]: {
          type: string
          label: string
          value: string | string[]
          legend?: string
          exclude?: boolean
        }
      }
    }

    interface AjaxActionArgs extends AjaxActionData {
      env: EnvCloudflare
      request: Request
    }

    interface AjaxActionReturn {
      error?: {
        message: string
        code?: number
      }
      success?: {
        message: string
        headers?: {
          [key: string]: string
        }
      }
    }

    /* Normalize image utility arguments */

    interface ImageData {
      base?: string
      alt?: string
      width?: number
      height?: number
      format?: string
      description?: string
      file?: {
        url: string
        contentType: string
        details: {
          image: {
            width: number
            height: number
          }
        }
      }
    }

    /* Get image utility arguments */

    interface ImageArgs {
      data?: ImageData | undefined
      classes?: string
      attr?: string
      width?: string | number
      height?: string | number
      returnAspectRatio?: boolean
      lazy?: boolean
      source?: boolean
      quality?: number
      maxWidth?: number
      viewportWidth?: number
    }

    /* Config options */

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
        archive: {
          [key: string]: ArchiveMeta
        }
        taxonomy: {
          [key: string]: TaxonomyMeta
        }
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
      actions: {
        [key: string]: Function
      }
      filters: {
        [key: string]: Function
      }
      image: {
        url: string
        sizes: number[]
        quality: number
      }
      navigation: Navigation[]
      navigationItem: NavigationItem[]
      scriptMeta: {
        [key: string]: any
      }
      formMeta: {
        [key: string]: any
      }
      archive: {
        ids: {
          [key: string]: any
        }
        posts: {
          [key: string]: any
        }
        terms: {
          [key: string]: any
        }
      }
      env: {
        dev: boolean
        prod: boolean
        build: boolean
        cache: boolean
        urls: {
          dev: string
          prod: string
        }
      }
      store: {
        dir: string
        files: StoreFiles
      }
      serverless: {
        dir: string
        import: string
        files: {
          ajax: string
          preview: string
          reload: string
        }
        routes: {
          reload: ServerlessRoute[]
          [key: string]: ServerlessRoute[]
        }
      }
      redirects: {
        file: string
        data: string[]
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
      apiKeys: {
        smtp2go: string
      }
      console: {
        green: string
        red: string
      }
      vars: any
    }
  }
}

export default FRM
