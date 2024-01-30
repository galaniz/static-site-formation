/**
 * Utils - Get Prop Types
 */

/* Imports */

import type { ImagesProps } from '../processImages/processImagesTypes'

export interface PropId {
  id?: string
  sys?: {
    id?: string
  }
}

export interface PropType {
  renderType?: string
  contentType?: string
  sys?: {
    type?: string
    contentType?: {
      sys?: {
        id?: string
      }
    }
  }
}

export interface PropFile extends Partial<ImagesProps> {
  fields?: {
    file?: {
      url?: string
      contentType?: string
      fileName?: string
      details?: {
        image?: {
          width?: number
          height?: number
        }
        size?: number
      }
    }
    description?: string
    [key: string]: unknown
  }
}

export interface PropFileReturn {
  url: string
  path: string
  name: string
  type: string
  format: string
  alt: string
  naturalWidth: number
  naturalHeight: number
  size: number
}

export interface Prop {
  id: (obj?: PropId) => string
  type: (obj?: PropType, subtype?: string) => string
  self: <T>(obj: T) => T
  fields: <T, P extends keyof T>(obj: T, prop: P) => T[P] | undefined
  file: (obj?: PropFile, prop?: string) => string | PropFileReturn | undefined
}
