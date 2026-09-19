import type { SchemaTypeDefinition } from 'sanity'

import { about } from './documents/about'
import { cv } from './documents/cv'
import { exhibition } from './documents/exhibition'
import { settings } from './documents/settings'
import { work } from './documents/work'
import { figure } from './objects/figure'
import { installationImage } from './objects/installationImage'
import { richText } from './objects/richText'

export const schemaTypes: SchemaTypeDefinition[] = [
  about,
  cv,
  work,
  exhibition,
  settings,
  figure,
  installationImage,
  richText,
]

/** Documents that exist exactly once and cannot be created or deleted by hand. */
export const singletonTypes = new Set(['about', 'cv', 'settings'])
