import { defineField, defineType } from 'sanity'

export const exhibition = defineType({
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Generated from the title. This becomes the exhibition’s page address.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateText',
      title: 'Date',
      type: 'string',
      description: 'Shown on the site exactly as written, e.g. “March 2024” or “June – August 2023”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Sort date',
      type: 'date',
      description: 'Not shown on the site. Used to order exhibitions, newest first.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'Optional. Gallery or museum, and city.',
    }),
    defineField({
      name: 'curatorialText',
      title: 'Curatorial text',
      type: 'richText',
    }),
    defineField({
      name: 'works',
      title: 'Works',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'work' }] }],
      description:
        'Works shown in this exhibition. Drag to reorder. Each work automatically links back to this exhibition.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Sharing image',
      type: 'figure',
      description:
        'Optional. Used as the preview image when a link to this exhibition is shared. Falls back to the first work.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description:
        'Optional. One or two sentences shown in Google results. Falls back to the start of the curatorial text.',
      validation: (rule) => rule.max(160),
    }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', dateText: 'dateText', venue: 'venue', media: 'coverImage' },
    prepare: ({ title, dateText, venue, media }) => ({
      title,
      subtitle: [dateText, venue].filter(Boolean).join(' · '),
      media,
    }),
  },
})
