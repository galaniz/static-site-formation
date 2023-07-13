/**
 * Static Site Formation - interfaces
 */

declare global {
  module FRM {
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
      linkContentType?: string
      [key: string]: any
    }

    interface SlugBase {
      slug: string
      title: string
      singular: string
      plural: string
      archiveId?: object
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
      content?: string
    }

    interface PreviewData {
      id: string
      contentType: string
    }

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
      description?: string
      url?: string
      image?: string
      canonical?: string
      prev?: string
      next?: string
      noIndex?: boolean
      isIndex?: boolean
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
      env: any
      request: any
    }

    interface AjaxActionReturn {
      error?: {
        message: string
        code?: number
      }
      success?: {
        message: string
        headers?: any
      }
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
        style?: string
        attr?: string
        richTextStyles?: boolean
        [key: string]: any
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
      parents?: object[]
    }

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
      parents?: Array<{
        renderType: string
        internalLink?: InternalLink
        externalLink?: string
      }>
    }

    interface RichTextContentMark {
      type: string
    }

    interface RichTextContentItem {
      tag?: string | string[]
      link?: string
      internalLink?: any
      content?: string | RichTextContentItem[]
      nodeType?: string
      value?: string
      marks?: RichTextContentMark[]
      data?: {
        uri?: string
        target?: any
      }
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

    interface RenderItem {
      id: string
      title: string
      slug: string
      content?: any
      meta?: object
      basePermalink?: string
      [key: string]: any
    }

    interface RenderStartActionArgs {
      contentType: string
      props: RenderItem
    }

    interface RenderEndActionArgs {
      contentType: string
      slug: string
      output: string
      props: RenderItem
    }

    interface RenderFilterArgs {
      contentType: string
      slug: string
      props: RenderItem
    }

    interface RenderContentFilterArgs {
      renderType: string
      args: {
        args: any
        parents?: Array<{
          renderType: string
          props: object
        }>
        pageData?: object
        pageContains?: string[]
        navigations?: object
        serverlessData?: ServerlessData
      }
    }

    interface ImageData {
      base?: string
      alt?: string
      width?: number
      height?: number
      description?: string
      file?: {
        url: string
        details: {
          image: {
            width: number
            height: number
          }
        }
      }
    }

    interface ImageArgs {
      data?: ImageData | undefined
      classes?: string
      attr?: string
      width?: string | number
      height?: string | number
      returnAspectRatio?: boolean
      lazy?: boolean
      quality?: number
      maxWidth?: number
      viewportWidth?: number
    }

    interface LayoutArgs {
      meta: MetaReturn
      navigations?: object
      contentType?: string
      content: string
      contains?: string[]
      data?: RenderItem
      serverlessData?: ServerlessData | undefined
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
        archive: string[]
      }
      taxonomy: {
        [key: string]: {
          contentTypes: string[]
          props: string[]
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
      image: {
        url: string
        sizes: number[]
        quality: number
      }
      navigation: Navigation[]
      navigationItem: NavigationItem[]
      script: {
        [key: string]: any
      }
      formMeta: {
        [key: string]: any
      }
      archive: {
        ids: {
          [key: string]: object
        }
        posts: {
          [key: string]: any
        }
        terms: {
          [key: string]: any
        }
      }
      env: Env
      store: {
        dir: string
        files: StoreFiles
      }
      serverless: {
        dir: string
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
      modules: {
        cache?: Module
        contentfulResolveResponse?: Module
      }
      apiKeys: {
        smtp2go: string
      }
      console: {
        green: string
        red: string
      }
      [key: string]: any
    }
  }
}

export default FRM
