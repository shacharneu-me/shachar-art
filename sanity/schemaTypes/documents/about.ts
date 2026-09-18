import { defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      initialValue: 'About',
      description: 'The heading at the top of the page.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'figure',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'richText',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description: 'Optional. Shown in Google results. Falls back to the start of the text above.',
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: { media: 'image' },
    prepare: ({ media }) => ({ title: 'About', media }),
  },
})
