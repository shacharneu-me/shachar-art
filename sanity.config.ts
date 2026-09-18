'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId, studioBasePath } from '@/sanity/env'
import { schemaTypes, singletonTypes } from '@/sanity/schemaTypes'
import { structure } from '@/sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Website',
  basePath: studioBasePath,
  projectId: projectId || 'unconfigured',
  dataset,
  schema: {
    types: schemaTypes,
    // Keep About / CV / Settings out of the global "create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges'].includes(action))
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
