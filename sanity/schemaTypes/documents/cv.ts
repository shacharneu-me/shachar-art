import { defineField, defineType } from 'sanity'

export const cv = defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      initialValue: 'CV',
      description: 'The heading at the top of the page.',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'richText',
      description: 'Use “Heading” for section names such as Education or Awards.',
    }),
    defineField({
      name: 'file',
      title: 'Downloadable CV',
      type: 'file',
      options: { accept: '.pdf' },
      description: 'Optional. A PDF visitors can download.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description: 'Optional. Shown in Google results.',
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'CV' }),
  },
})
